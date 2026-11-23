import { print } from "graphql"
import { describe, expect, it } from "vitest"
import { changePublicationMutation } from "../graphql/mutations.ts"
import { findVideoQuery, listVideosQuery } from "../graphql/queries.ts"
import { ContentStatus, PublicationErrorCode } from "../content/publication.ts"
import { findVideoById, videoIds } from "./database.ts"
import { dropNextSavedReply } from "./services.ts"

async function askBackend(
  document: Parameters<typeof print>[0],
  variables?: Record<string, unknown>,
) {
  const response = await fetch(new URL("/graphql", window.location.href), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
  })

  return response.json() as Promise<{
    data?: {
      contents?: Array<{ id: string; status: string }>
      content?: { status: string } | null
      setPublication?: { status: string }
    }
    errors?: Array<{
      message: string
      extensions?: { code?: string; content?: { status?: string } }
    }>
  }>
}

describe("backend services", () => {
  it("returns videos for a status filter", async () => {
    const body = await askBackend(listVideosQuery, { status: ContentStatus.DRAFT })
    const ids = body.data?.contents?.map((video) => video.id)

    expect(ids).toEqual([videoIds.roughCut, videoIds.colorNotes, videoIds.northStar13])
  })

  it("returns null when the video id is unknown", async () => {
    const body = await askBackend(findVideoQuery, { id: "missing" })

    expect(body.data?.content).toBeNull()
  })

  it("rejects a stale publish and returns the current draft", async () => {
    const body = await askBackend(changePublicationMutation, {
      id: videoIds.roughCut,
      published: true,
    })

    expect(body.errors?.[0]?.extensions?.code).toBe(PublicationErrorCode.rejected)
    expect(body.errors?.[0]?.extensions?.content?.status).toBe(ContentStatus.DRAFT)
    expect(body.data?.setPublication).toBeUndefined()
  })

  it("publishes a ready video", async () => {
    const body = await askBackend(changePublicationMutation, {
      id: videoIds.northStar,
      published: true,
    })

    expect(body.data?.setPublication?.status).toBe(ContentStatus.PUBLISHED)
    expect(findVideoById(videoIds.northStar)?.status).toBe(ContentStatus.PUBLISHED)
  })

  it("unpublishes a published video back to ready", async () => {
    const body = await askBackend(changePublicationMutation, {
      id: videoIds.liveRoom,
      published: false,
    })

    expect(body.data?.setPublication?.status).toBe(ContentStatus.READY)
    expect(findVideoById(videoIds.liveRoom)?.status).toBe(ContentStatus.READY)
  })

  it("keeps a dropped reply waiting when the save is rejected", async () => {
    dropNextSavedReply()

    const rejection = await askBackend(changePublicationMutation, {
      id: videoIds.roughCut,
      published: true,
    })

    expect(rejection.errors?.[0]?.extensions?.code).toBe(PublicationErrorCode.rejected)

    await expect(
      askBackend(changePublicationMutation, { id: videoIds.northStar, published: true }),
    ).rejects.toThrow()

    expect(findVideoById(videoIds.northStar)?.status).toBe(ContentStatus.PUBLISHED)
  })

  it("drops the reply after the publication has been saved", async () => {
    dropNextSavedReply()

    await expect(
      askBackend(changePublicationMutation, { id: videoIds.northStar, published: true }),
    ).rejects.toThrow()

    expect(findVideoById(videoIds.northStar)?.status).toBe(ContentStatus.PUBLISHED)
  })
})
