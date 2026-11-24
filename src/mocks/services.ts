/** Turns a GraphQL request into a call, then turns the result back into a reply. */

import { HttpResponse } from "msw"
import { graphql } from "msw/graphql"
import {
  isKnownVideoStatus,
  PublicationErrorCode,
  changePublication,
  type Content,
} from "../content/publication.ts"
import { findVideoById, findVideos } from "./database.ts"

const graphqlApi = graphql.link("/graphql")

let shouldDropNextSavedReply = false

/** The next successful save still happens. The reply to that save is then thrown away. */
export function dropNextSavedReply() {
  shouldDropNextSavedReply = true
}

export function clearDroppedReply() {
  shouldDropNextSavedReply = false
}

let isOffline = false

/** While offline, every request fails before reaching the server, like a lost connection. */
export function setBackendOffline(offline: boolean) {
  isOffline = offline
}

export function isBackendOffline() {
  return isOffline
}

function textOrNothing(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function toApiVideo(video: Content) {
  return { __typename: "Content" as const, ...video }
}

export const services = [
  // Runs first for every operation. Returning nothing lets the request fall through to the real handler.
  graphqlApi.operation(() => {
    if (isOffline) return HttpResponse.error()
  }),
  graphqlApi.query("Contents", ({ variables }) => {
    const statusFilter = variables.status
    if (statusFilter != null && !isKnownVideoStatus(statusFilter)) {
      return HttpResponse.json({
        errors: [{ message: "Unknown content status." }],
      })
    }

    return HttpResponse.json({
      data: {
        contents: findVideos({
          searchText: textOrNothing(variables.search),
          status: textOrNothing(statusFilter),
        }).map(toApiVideo),
      },
    })
  }),
  graphqlApi.query("Content", ({ variables }) => {
    const videoId = textOrNothing(variables.id)
    const video = videoId ? findVideoById(videoId) : null

    return HttpResponse.json({
      data: { content: video ? toApiVideo(video) : null },
    })
  }),
  
  graphqlApi.mutation("SetPublication", ({ variables }) => {
    const videoId = textOrNothing(variables.id)
    const shouldBePublished = variables.published
    if (!videoId || typeof shouldBePublished !== "boolean") {
      return HttpResponse.json({
        errors: [{ message: "Publication input is invalid." }],
      })
    }

    const saveResult = changePublication(videoId, shouldBePublished)

    if (saveResult.result === "not_found") {
      return HttpResponse.json({
        errors: [
          {
            message: "Content not found.",
            extensions: { code: PublicationErrorCode.missing },
          },
        ],
      })
    }

    if (saveResult.result === "rejected") {
      return HttpResponse.json({
        errors: [
          {
            message: saveResult.message,
            extensions: {
              code: PublicationErrorCode.rejected,
              content: toApiVideo(saveResult.video),
            },
          },
        ],
      })
    }

    if (shouldDropNextSavedReply) {
      shouldDropNextSavedReply = false
      return HttpResponse.error()
    }

    return HttpResponse.json({
      data: { setPublication: toApiVideo(saveResult.video) },
    })
  }),
]
