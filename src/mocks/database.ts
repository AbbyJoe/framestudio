/** The videos. This array is the database. It lives in memory and resets when the page refreshes. */

import type { Content, ContentStatus } from "../content/publication.ts"

export const videoIds = {
  northStar: "cnt_north_star",
  editorInterview: "cnt_editor_interview",
  roughCut: "cnt_rough_cut",
  colorNotes: "cnt_color_notes",
  liveRoom: "cnt_live_room",
  openingNight: "cnt_opening_night",
  northStar13: "cnt_north_star_13",
  northStar14: "cnt_north_star_14",
} as const

const initialVideos: Content[] = [
  {
    id: videoIds.northStar,
    title: "North Star, episode 12",
    thumbnailUrl: "https://picsum.photos/seed/cnt_north_star/640/360",
    durationSeconds: 1860,
    uploadedAt: "2026-11-18T09:30:00.000Z",
    status: "READY",
  },
  {
    id: videoIds.roughCut,
    title: "Rough cut: studio tour",
    thumbnailUrl: "https://picsum.photos/seed/cnt_rough_cut/640/360",
    durationSeconds: 2400,
    uploadedAt: "2026-11-19T14:10:00.000Z",
    status: "DRAFT",
  },
  {
    id: videoIds.liveRoom,
    title: "Live room recording",
    thumbnailUrl: "https://picsum.photos/seed/cnt_live_room/640/360",
    durationSeconds: 3120,
    uploadedAt: "2026-11-02T18:00:00.000Z",
    status: "PUBLISHED",
  },
  {
    id: videoIds.editorInterview,
    title: "Interview with the editor",
    thumbnailUrl: "https://picsum.photos/seed/cnt_editor_interview/640/360",
    durationSeconds: 980,
    uploadedAt: "2026-11-16T11:45:00.000Z",
    status: "READY",
  },
  {
    id: videoIds.colorNotes,
    title: "Color grade notes",
    thumbnailUrl: "https://picsum.photos/seed/cnt_color_notes/640/360",
    durationSeconds: 420,
    uploadedAt: "2026-11-20T08:05:00.000Z",
    status: "DRAFT",
  },
  {
    id: videoIds.openingNight,
    title: "Opening night recap",
    thumbnailUrl: "https://picsum.photos/seed/cnt_opening_night/640/360",
    durationSeconds: 1540,
    uploadedAt: "2026-10-28T20:15:00.000Z",
    status: "PUBLISHED",
  },
  {
    id: videoIds.northStar13,
    title: "North Star, episode 13",
    thumbnailUrl: "https://picsum.photos/seed/cnt_north_star_13/640/360",
    durationSeconds: 1860,
    uploadedAt: "2026-10-28T20:15:00.000Z",
    status: "DRAFT",
  },
  {
    id: videoIds.northStar14,
    title: "North Star, episode 14",
    thumbnailUrl: "https://picsum.photos/seed/cnt_north_star_14/640/360",
    durationSeconds: 1860,
    uploadedAt: "2026-10-28T20:15:00.000Z",
    status: "READY",
  },
]

let videos = copyInitialVideos()

function copyInitialVideos(): Content[] {
  return initialVideos.map((video) => ({ ...video }))
}

function copyVideo(video: Content): Content {
  return { ...video }
}

export function resetDatabase() {
  videos = copyInitialVideos()
}

export function findVideos(input: {
  searchText?: string | null
  status?: string | null
}): Content[] {
  const searchText = input.searchText?.trim().toLowerCase() ?? ""

  return videos
    .filter((video) => {
      if (input.status && video.status !== input.status) return false
      if (searchText && !video.title.toLowerCase().includes(searchText)) {
        return false
      }
      return true
    })
    .map(copyVideo)
}

export function findVideoById(videoId: string): Content | null {
  const video = videos.find((item) => item.id === videoId)
  return video ? copyVideo(video) : null
}

export function updateVideoStatus(
  videoId: string,
  status: ContentStatus,
): Content | null {
  const video = videos.find((item) => item.id === videoId)
  if (!video) return null

  video.status = status
  return copyVideo(video)
}
