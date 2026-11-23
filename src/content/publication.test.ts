import { describe, expect, it } from "vitest"
import {
  ContentStatus,
  decidePublicationChange,
  PublicationErrorCode,
  publishRejectedMessage,
  readPublicationReply,
  unknownResultMessage,
  unpublishRejectedMessage,
  type Content,
} from "./publication.ts"

describe("decidePublicationChange", () => {
  it("rejects publishing a draft", () => {
    expect(decidePublicationChange(ContentStatus.DRAFT, true)).toEqual({
      result: "rejected",
      status: ContentStatus.DRAFT,
      message: publishRejectedMessage,
    })
  })

  it("publishes a ready video", () => {
    expect(decidePublicationChange(ContentStatus.READY, true)).toEqual({
      result: "saved",
      status: ContentStatus.PUBLISHED,
    })
  })

  it("leaves an already published video published", () => {
    expect(decidePublicationChange(ContentStatus.PUBLISHED, true)).toEqual({
      result: "saved",
      status: ContentStatus.PUBLISHED,
    })
  })

  it("rejects unpublishing a draft", () => {
    expect(decidePublicationChange(ContentStatus.DRAFT, false)).toEqual({
      result: "rejected",
      status: ContentStatus.DRAFT,
      message: unpublishRejectedMessage,
    })
  })

  it("leaves a ready video unpublished", () => {
    expect(decidePublicationChange(ContentStatus.READY, false)).toEqual({
      result: "saved",
      status: ContentStatus.READY,
    })
  })

  it("unpublishes a published video back to ready", () => {
    expect(decidePublicationChange(ContentStatus.PUBLISHED, false)).toEqual({
      result: "saved",
      status: ContentStatus.READY,
    })
  })
})

const roughCut: Content = {
  id: "cnt_rough_cut",
  title: "Rough cut: studio tour",
  thumbnailUrl: "https://example.com/rough.jpg",
  durationSeconds: 2400,
  uploadedAt: "2026-11-19T14:10:00.000Z",
  status: ContentStatus.DRAFT,
}

describe("readPublicationReply", () => {
  it("treats a missing reply as unknown", () => {
    expect(
      readPublicationReply({
        replyNeverArrived: true,
        serverErrors: [
          {
            message: publishRejectedMessage,
            extensions: { code: PublicationErrorCode.rejected, content: roughCut },
          },
        ],
      }),
    ).toEqual({
      result: "unknown",
      message: unknownResultMessage,
    })
  })

  it("treats a rejection as a known answer and keeps the video the server sent", () => {
    expect(
      readPublicationReply({
        replyNeverArrived: false,
        serverErrors: [
          {
            message: publishRejectedMessage,
            extensions: { code: PublicationErrorCode.rejected, content: roughCut },
          },
        ],
      }),
    ).toEqual({
      result: "rejected",
      message: publishRejectedMessage,
      video: roughCut,
    })
  })

  it("does not invent a video when a rejection arrives without one", () => {
    expect(
      readPublicationReply({
        replyNeverArrived: false,
        serverErrors: [
          {
            message: "Publication was rejected.",
            extensions: { code: PublicationErrorCode.rejected },
          },
        ],
      }),
    ).toEqual({
      result: "failed",
      message: "Publication was rejected.",
    })
  })

  it("treats any other server error as a known failure", () => {
    expect(
      readPublicationReply({
        replyNeverArrived: false,
        serverErrors: [{ message: "Content not found." }],
      }),
    ).toEqual({
      result: "failed",
      message: "Content not found.",
    })
  })
})
