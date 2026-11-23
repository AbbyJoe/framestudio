import { findVideoById, updateVideoStatus } from "../mocks/database.ts"

export const ContentStatus = {
  DRAFT: "DRAFT",
  READY: "READY",
  PUBLISHED: "PUBLISHED",
} as const

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus]

const knownVideoStatuses = [
  ContentStatus.DRAFT,
  ContentStatus.READY,
  ContentStatus.PUBLISHED,
] as const

export type Content = {
  id: string
  title: string
  thumbnailUrl: string
  durationSeconds: number
  uploadedAt: string
  status: ContentStatus
}

export function isKnownVideoStatus(value: unknown): value is ContentStatus {
  return (
    typeof value === "string" &&
    (knownVideoStatuses as readonly string[]).includes(value)
  )
}

/**
 * shouldBePublished true means Publish. false means Unpublish.
 * - A draft cannot be published or unpublished here.
 * - A ready video becomes published.
 * - Publishing a video that is already published changes nothing, so a retry is safe.
 * - Unpublishing a published video returns it to ready.
 * - Unpublishing a ready video changes nothing. It is already unpublished.
 */
export type PublicationChange =
  | { result: "saved"; status: ContentStatus }
  | { result: "rejected"; status: ContentStatus; message: string }

export const PublicationErrorCode = {
  rejected: "CONFLICT",
  missing: "NOT_FOUND",
} as const

export const publishRejectedMessage =
  "This video is no longer eligible for publication."

export const unpublishRejectedMessage =
  "This video can't be unpublished from its current state."

/** Decides what to do with a publication change. */
export function decidePublicationChange(
  currentStatus: ContentStatus,
  shouldBePublished: boolean,
): PublicationChange {
  if (shouldBePublished) {
    if (currentStatus === ContentStatus.DRAFT) {
      return {
        result: "rejected",
        status: currentStatus,
        message: publishRejectedMessage,
      }
    }

    return { result: "saved", status: ContentStatus.PUBLISHED }
  }

  if (currentStatus === ContentStatus.DRAFT) {
    return {
      result: "rejected",
      status: currentStatus,
      message: unpublishRejectedMessage,
    }
  }

  return { result: "saved", status: ContentStatus.READY }
}

export type PublicationSaveResult =
  | { result: "saved"; video: Content }
  | { result: "rejected"; message: string; video: Content }
  | { result: "not_found" }

/** Asks the rule, then stores the new status. */
export function changePublication(
  videoId: string,
  shouldBePublished: boolean,
): PublicationSaveResult {
  const video = findVideoById(videoId)
  if (!video) return { result: "not_found" }

  const publicationChange = decidePublicationChange(video.status, shouldBePublished)
  if (publicationChange.result === "rejected") {
    return {
      result: "rejected",
      message: publicationChange.message,
      video,
    }
  }

  const savedVideo = updateVideoStatus(videoId, publicationChange.status)
  if (!savedVideo) return { result: "not_found" }

  return { result: "saved", video: savedVideo }
}

export type ServerError = {
  message: string
  extensions?: {
    code?: string
    content?: Content
  }
}

export type PublicationReply =
  | { result: "rejected"; message: string; video: Content }
  | { result: "unknown"; message: string }
  | { result: "failed"; message: string }

export const unknownResultMessage =
  "We couldn't confirm whether this change was saved. Check the latest status before trying again."

/** An error from the server is an answer. No reply at all means we do not know if the save happened. */
export function readPublicationReply(input: {
  replyNeverArrived: boolean
  serverErrors: ServerError[]
}): PublicationReply {
  if (input.replyNeverArrived) {
    return { result: "unknown", message: unknownResultMessage }
  }

  const rejection = input.serverErrors.find(
    (error) => error.extensions?.code === PublicationErrorCode.rejected,
  )

  if (rejection) {
    const video = rejection.extensions?.content
    if (video) {
      return { result: "rejected", message: rejection.message, video }
    }

    return {
      result: "failed",
      message: rejection.message || "Publication was rejected.",
    }
  }

  return {
    result: "failed",
    message: input.serverErrors[0]?.message || "The publication change failed.",
  }
}
