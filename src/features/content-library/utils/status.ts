import type { ContentStatus } from "../../../content/publication.ts"

export const statusOrder: ContentStatus[] = ["DRAFT", "READY", "PUBLISHED"]

type StatusDetails = {
  label: string
  summary: string
  textClass: string
  surfaceClass: string
  ringClass: string
  dotClass: string
}

export const statusDetails: Record<ContentStatus, StatusDetails> = {
  DRAFT: {
    label: "Draft",
    summary: "This video isn't ready for publication yet.",
    textClass: "text-zinc-300",
    surfaceClass: "bg-zinc-400/10",
    ringClass: "ring-zinc-400/20",
    dotClass: "bg-zinc-400",
  },
  READY: {
    label: "Ready",
    summary: "This video is ready. Publish it to make it available to viewers.",
    textClass: "text-amber-300",
    surfaceClass: "bg-amber-400/10",
    ringClass: "ring-amber-400/25",
    dotClass: "bg-amber-400",
  },
  PUBLISHED: {
    label: "Published",
    summary: "This video is live and available to viewers.",
    textClass: "text-emerald-300",
    surfaceClass: "bg-emerald-400/10",
    ringClass: "ring-emerald-400/25",
    dotClass: "bg-emerald-400",
  },
}

export type PublicationAction =
  | { kind: "publish"; label: string; pendingLabel: string; hint: string }
  | { kind: "unpublish"; label: string; pendingLabel: string; hint: string }
  | { kind: "none"; label: string; hint: string }

/**
 * Which action the interface offers for the status it last saw.
 * This is only a hint for the screen. The server still decides whether the change is allowed.
 */
export function publicationActionFor(status: ContentStatus): PublicationAction {
  switch (status) {
    case "READY":
      return {
        kind: "publish",
        label: "Publish",
        pendingLabel: "Publishing…",
        hint: "Viewers can watch this video as soon as it's published.",
      }
    case "PUBLISHED":
      return {
        kind: "unpublish",
        label: "Unpublish",
        pendingLabel: "Unpublishing…",
        hint: "Unpublishing hides this video from viewers and returns it to Ready.",
      }
    case "DRAFT":
      return {
        kind: "none",
        label: "Not ready",
        hint: "Drafts can't be published. Finish preparing this video first.",
      }
  }
}
