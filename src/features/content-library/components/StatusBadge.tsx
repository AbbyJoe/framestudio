import type { ContentStatus } from "../../../content/publication.ts"
import { cx } from "../../../lib/cx.ts"
import { statusDetails } from "../utils/status.ts"

type StatusBadgeProps = {
  status: ContentStatus
  size?: "sm" | "md"
  /** Use a dark glass background so the badge stays readable on top of a thumbnail. */
  overlay?: boolean
  className?: string
}

export function StatusBadge({
  status,
  size = "sm",
  overlay = false,
  className,
}: StatusBadgeProps) {
  const details = statusDetails[status]

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full font-bold tracking-wider uppercase ring-1 ring-inset",
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]",
        overlay ? "bg-black/60 backdrop-blur-md" : details.surfaceClass,
        details.textClass,
        details.ringClass,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        {status === "PUBLISHED" && (
          <span
            className={cx("absolute inset-0 animate-ping rounded-full opacity-70", details.dotClass)}
          />
        )}
        <span className={cx("relative size-1.5 rounded-full", details.dotClass)} />
      </span>
      {details.label}
    </span>
  )
}
