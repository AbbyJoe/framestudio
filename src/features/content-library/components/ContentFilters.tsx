import type { ContentStatus } from "../../../content/publication.ts"
import { Icon } from "../../../components/Icon.tsx"
import { cx } from "../../../lib/cx.ts"
import { statusDetails } from "../utils/status.ts"

type ContentFiltersProps = {
  search: string
  onSearchChange: (search: string) => void
  /** null means "All". */
  status: ContentStatus | null
  onStatusChange: (status: ContentStatus | null) => void
}

const statusTabs: Array<{ value: ContentStatus | null; label: string }> = [
  { value: null, label: "All" },
  { value: "PUBLISHED", label: statusDetails.PUBLISHED.label },
  { value: "READY", label: statusDetails.READY.label },
  { value: "DRAFT", label: statusDetails.DRAFT.label },
]

export function ContentFilters({ search, onSearchChange, status, onStatusChange }: ContentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <label htmlFor="content-search" className="sr-only">
          Search videos
        </label>
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        />
        <input
          id="content-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-10 text-sm text-ink placeholder:text-ink-subtle transition outline-none hover:border-line-strong focus:border-brand/60 focus:ring-4 focus:ring-brand/15"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-subtle transition hover:bg-white/8 hover:text-ink"
          >
            <Icon name="x" className="size-3.5" />
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Filter by status"
        className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:rounded-full md:border md:border-line md:bg-surface md:p-1"
      >
        {statusTabs.map((tab) => {
          const active = status === tab.value

          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusChange(tab.value)}
              className={cx(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                active
                  ? "bg-ink text-canvas"
                  : "border border-line text-ink-muted hover:bg-white/6 hover:text-ink md:border-transparent",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
