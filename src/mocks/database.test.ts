import { describe, expect, it } from "vitest"
import { ContentStatus } from "../content/publication.ts"
import {
  findVideoById,
  findVideos,
  updateVideoStatus,
  videoIds,
} from "./database.ts"

describe("database", () => {
  it("filters by status and a case-insensitive title search", () => {
    const matches = findVideos({ searchText: "  NORTH star ", status: null })

    expect(matches.map((video) => video.id)).toEqual([
      videoIds.northStar,
      videoIds.northStar13,
      videoIds.northStar14,
    ])
  })

  it("returns every video when no filter is given", () => {
    expect(findVideos({ searchText: null, status: null })).toHaveLength(8)
  })

  it("stores a new status for a video", () => {
    const saved = updateVideoStatus(videoIds.northStar, ContentStatus.PUBLISHED)

    expect(saved?.status).toBe(ContentStatus.PUBLISHED)
    expect(findVideoById(videoIds.northStar)?.status).toBe(ContentStatus.PUBLISHED)
  })

  it("returns null when the video id is unknown", () => {
    expect(findVideoById("missing")).toBeNull()
    expect(updateVideoStatus("missing", ContentStatus.PUBLISHED)).toBeNull()
  })
})
