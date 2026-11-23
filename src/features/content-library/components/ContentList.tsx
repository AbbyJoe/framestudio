import type { Content } from "../../../content/publication.ts"
import { ContentCard } from "./ContentCard.tsx"

const gridClass = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

export function ContentList({ contents }: { contents: Content[] }) {
  return (
    <ul className={gridClass} aria-label="Videos">
      {contents.map((content) => (
        <li key={content.id}>
          <ContentCard content={content} />
        </li>
      ))}
    </ul>
  )
}

/** Same grid as the real cards, so nothing jumps when the data arrives. */
export function ContentListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading videos">
      <ul className={gridClass} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="aspect-video animate-pulse bg-white/4" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/6" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/6" />
              <div className="flex items-center justify-between pt-3">
                <div className="h-3 w-20 animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-14 animate-pulse rounded-full bg-white/5" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
