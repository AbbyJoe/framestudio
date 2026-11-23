import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { describe, expect, it } from "vitest"
import { AppProviders } from "../../app/providers.tsx"
import { AppRoutes } from "../../app/routes.tsx"
import { findVideoById, updateVideoStatus, videoIds } from "../../mocks/database.ts"
import { dropNextSavedReply, setBackendOffline } from "../../mocks/services.ts"

/** Renders the real app against the mock GraphQL backend, starting at `path`. */
function renderApp(path: string) {
  const user = userEvent.setup()
  render(
    <AppProviders>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  )
  return { user }
}

function publicationPanel() {
  return within(screen.getByRole("region", { name: "Publication" }))
}

describe("Content library", () => {
  it("shows the videos returned by the server", async () => {
    renderApp("/")

    const list = await screen.findByRole("list", { name: "Videos" })
    expect(within(list).getAllByRole("listitem")).toHaveLength(8)
    expect(within(list).getByRole("link", { name: "North Star, episode 12" })).toBeInTheDocument()
  })

  it("searches and filters through the server", async () => {
    const { user } = renderApp("/")
    await screen.findByRole("link", { name: "North Star, episode 12" })

    await user.type(screen.getByLabelText("Search videos"), "interview")
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "North Star, episode 12" })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole("link", { name: "Interview with the editor" })).toBeInTheDocument()

    await user.clear(screen.getByLabelText("Search videos"))
    await user.click(screen.getByRole("button", { name: "Draft" }))
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(3))
    expect(screen.getByRole("link", { name: "Rough cut: studio tour" })).toBeInTheDocument()
  })

  it("shows an error with a working retry when the library can't load", async () => {
    setBackendOffline(true)
    const { user } = renderApp("/")

    expect(await screen.findByText("We couldn't load your library")).toBeInTheDocument()

    setBackendOffline(false)
    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(await screen.findByRole("link", { name: "North Star, episode 12" })).toBeInTheDocument()
  })
})

describe("Publishing", () => {
  it("does not offer Publish for a draft", async () => {
    renderApp(`/contents/${videoIds.roughCut}`)

    expect(await screen.findByRole("button", { name: "Not ready" })).toBeDisabled()
    expect(screen.queryByRole("button", { name: "Publish" })).not.toBeInTheDocument()
  })

  it("publishes a ready video and shows the status the server returned", async () => {
    const { user } = renderApp(`/contents/${videoIds.northStar}`)

    await user.click(await screen.findByRole("button", { name: "Publish" }))

    expect(await screen.findByText("Video published")).toBeInTheDocument()
    expect(publicationPanel().getByRole("button", { name: "Unpublish" })).toBeEnabled()
    expect(findVideoById(videoIds.northStar)?.status).toBe("PUBLISHED")
  })

  it("Scenario A: shows the server's status when another operator moved the video to Draft", async () => {
    const { user } = renderApp(`/contents/${videoIds.northStar}`)
    const publishButton = await screen.findByRole("button", { name: "Publish" })

    // Another operator changes the video after this screen loaded it.
    updateVideoStatus(videoIds.northStar, "DRAFT")
    await user.click(publishButton)

    expect(await screen.findByText("Publication status changed")).toBeInTheDocument()
    expect(publicationPanel().getByRole("button", { name: "Not ready" })).toBeDisabled()
    expect(findVideoById(videoIds.northStar)?.status).toBe("DRAFT")
  })

  it("Scenario B: confirms with the server when the reply to a successful save is lost", async () => {
    const { user } = renderApp(`/contents/${videoIds.northStar}`)
    await screen.findByRole("button", { name: "Publish" })

    dropNextSavedReply()
    await user.click(screen.getByRole("button", { name: "Publish" }))

    // It saved on the server, so the screen must end up on Published, not report a failure.
    expect(await screen.findByText("Status confirmed")).toBeInTheDocument()
    expect(publicationPanel().getByRole("button", { name: "Unpublish" })).toBeEnabled()
    expect(screen.queryByText("Change not saved")).not.toBeInTheDocument()
  })

  it("Scenario B: keeps the last confirmed status and pauses actions when the check fails too", async () => {
    const { user } = renderApp(`/contents/${videoIds.northStar}`)
    await screen.findByRole("button", { name: "Publish" })

    setBackendOffline(true)
    await user.click(screen.getByRole("button", { name: "Publish" }))

    expect(await screen.findByText("Publication status couldn't be confirmed")).toBeInTheDocument()
    // Still shows Ready (the last confirmed status), and blocks a second attempt.
    expect(publicationPanel().getByRole("button", { name: "Publish" })).toBeDisabled()

    setBackendOffline(false)
    await user.click(screen.getByRole("button", { name: "Check again" }))

    expect(await screen.findByText("Status confirmed")).toBeInTheDocument()
    expect(publicationPanel().getByRole("button", { name: "Publish" })).toBeEnabled()
  })
})
