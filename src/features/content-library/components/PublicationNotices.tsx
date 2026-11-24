import { Button } from "../../../components/Button.tsx"
import { Icon } from "../../../components/Icon.tsx"
import type { PublicationNotice } from "../hooks/usePublication.ts"
import { statusDetails } from "../utils/status.ts"
import { Notice } from "./Notice.tsx"
import { StatusBadge } from "./StatusBadge.tsx"

type PublicationNoticeBannerProps = {
  notice: PublicationNotice
  onDismiss: () => void
  onCheckAgain: () => void
}

/** Turns the result of the last publication request into a message for the operator. */
export function PublicationNoticeBanner({ notice, onDismiss, onCheckAgain }: PublicationNoticeBannerProps) {
  const dismissButton = (
    <Button size="sm" variant="ghost" onClick={onDismiss}>
      Dismiss
    </Button>
  )

  switch (notice.kind) {
    case "saved":
      return (
        <Notice tone="success" title={notice.status === "PUBLISHED" ? "Video published" : "Video unpublished"} actions={dismissButton}>
          {notice.status === "PUBLISHED"
            ? "Viewers can now watch this video."
            : "This video is hidden from viewers and back to Ready."}
        </Notice>
      )

    // Scenario A: the server refused because the video changed after the operator loaded it.
    case "conflict":
      return (
        <Notice tone="warning" title="Publication status changed" actions={dismissButton}>
          <p>
            {notice.message} Someone else changed its status after you opened it. Review its current
            state before trying again.
          </p>
          <p className="mt-3 flex items-center gap-2">
            <StatusBadge status={notice.previousStatus} className="opacity-60" />
            <Icon name="arrowRight" className="size-3.5 text-ink-subtle" />
            <StatusBadge status={notice.currentStatus} />
          </p>
        </Notice>
      )

    // Scenario B: no reply arrived. Tell the operator; a silent refetch runs in the background.
    case "unknown":
      return (
        <Notice tone="warning" busy title="Couldn't confirm whether the change was saved">
          {notice.message} We're checking the latest status with the server. The status below won't
          change until we know.
        </Notice>
      )

    // Explicit "Check again" — operator-triggered confirm in progress.
    case "checking":
      return (
        <Notice tone="info" busy title="Confirming publication status">
          We're checking the latest status with the server. The status below won't change until we
          know.
        </Notice>
      )

    // Scenario B, step 2a: the server told us the real status.
    case "confirmed":
      return (
        <Notice tone="success" icon="check" title="Status confirmed" actions={dismissButton}>
          The server confirms this video is{" "}
          <span className="font-semibold text-ink">{statusDetails[notice.status].label}</span>.
        </Notice>
      )

    // Scenario B, step 2b: the check failed too. Keep the last confirmed status and let them retry.
    case "unconfirmed":
      return (
        <Notice
          tone="danger"
          icon="help"
          title="Publication status couldn't be confirmed"
          actions={
            <Button size="sm" variant="secondary" icon="refresh" onClick={onCheckAgain}>
              Check again
            </Button>
          }
        >
          We still can't reach the server. Your change may or may not have been saved. The status
          below is the last one we confirmed and may be out of date.
        </Notice>
      )

    case "failed":
      return (
        <Notice tone="danger" icon="alert" title="Change not saved" actions={dismissButton}>
          {notice.message}
        </Notice>
      )
  }
}
