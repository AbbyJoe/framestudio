import { Link } from "react-router"
import type { Content } from "../../../content/publication.ts"
import { Icon } from "../../../components/Icon.tsx"
import { formatUploadDate } from "../utils/format.ts"
import { StatusBadge } from "./StatusBadge.tsx"
import { Thumbnail } from "./Thumbnail.tsx"

export function ContentCard({ content }: { content: Content }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-2xl hover:shadow-black/40">
      <Thumbnail src={content.thumbnailUrl} durationSeconds={content.durationSeconds}>
        <StatusBadge status={content.status} overlay className="absolute top-2.5 left-2.5" />
      </Thumbnail>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold text-ink">
          {/* The ::after overlay makes the whole card clickable while keeping one real link. */}
          <Link
            to={`/contents/${content.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand"
          >
            {content.title}
          </Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 text-xs text-ink-subtle">
          <p className="flex items-center gap-1.5">
            <Icon name="calendar" className="size-3.5" />
            <time dateTime={content.uploadedAt}>{formatUploadDate(content.uploadedAt)}</time>
          </p>
          <span className="flex items-center gap-1 font-semibold transition group-hover:text-ink">
            Manage
            <Icon name="arrowRight" className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
