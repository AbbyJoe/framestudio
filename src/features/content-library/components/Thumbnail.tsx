import type { ReactNode } from "react"
import { cx } from "../../../lib/cx.ts"
import { formatDuration } from "../utils/format.ts"

type ThumbnailProps = {
  src: string
  durationSeconds?: number
  className?: string
  children?: ReactNode
}

/** 16:9 frame. If the image fails, the gradient behind it shows instead of a broken icon. */
export function Thumbnail({ src, durationSeconds, className, children }: ThumbnailProps) {
  return (
    <div
      className={cx(
        "relative aspect-video overflow-hidden bg-linear-to-br from-surface-raised via-surface to-canvas",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.visibility = "hidden"
        }}
        className="absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/25" />
      {durationSeconds != null && (
        <span className="absolute right-2.5 bottom-2.5 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
          {formatDuration(durationSeconds)}
        </span>
      )}
      {children}
    </div>
  )
}
