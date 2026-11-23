import type { ReactNode } from "react"
import type { Content } from "../../../content/publication.ts"
import { Icon } from "../../../components/Icon.tsx"
import { formatDurationLong, formatUploadDate } from "../utils/format.ts"
import { statusDetails } from "../utils/status.ts"
import { StatusBadge } from "./StatusBadge.tsx"
import { Thumbnail } from "./Thumbnail.tsx"

/** Player frame, status, and title. Split from the metadata so the publication panel can sit between them on mobile. */
export function ContentHero({ content }: { content: Content }) {
  return (
    <div className="min-w-0">
      <Thumbnail
        src={content.thumbnailUrl}
        durationSeconds={content.durationSeconds}
        className="rounded-3xl border border-line"
      >
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="grid size-16 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md sm:size-20">
            <Icon name="play" className="ml-1 size-6 sm:size-7" />
          </span>
        </div>
      </Thumbnail>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <StatusBadge status={content.status} />
        <span className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Icon name="clock" className="size-4" />
          {formatDurationLong(content.durationSeconds)}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Icon name="calendar" className="size-4" />
          Uploaded <time dateTime={content.uploadedAt}>{formatUploadDate(content.uploadedAt)}</time>
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
        {content.title}
      </h1>
    </div>
  )
}

export function ContentMetadata({ content }: { content: Content }) {
  return (
    <section aria-labelledby="details-heading" className="min-w-0">
      <h2 id="details-heading" className="text-sm font-bold tracking-wide text-ink-muted uppercase">
        Details
      </h2>
      {/* gap-px over a line-coloured background draws the cell dividers. */}
      <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        <DetailRow label="Content ID">
          <span className="font-mono text-[13px]">{content.id}</span>
        </DetailRow>
        <DetailRow label="Status">{statusDetails[content.status].label}</DetailRow>
        <DetailRow label="Duration">{formatDurationLong(content.durationSeconds)}</DetailRow>
        <DetailRow label="Uploaded">{formatUploadDate(content.uploadedAt)}</DetailRow>
      </dl>
    </section>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-canvas px-5 py-4">
      <dt className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-ink">{children}</dd>
    </div>
  )
}
