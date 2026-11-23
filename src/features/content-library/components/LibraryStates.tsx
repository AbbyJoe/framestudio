import type { ReactNode } from "react"
import { Button } from "../../../components/Button.tsx"
import { Icon, type IconName } from "../../../components/Icon.tsx"
import { cx } from "../../../lib/cx.ts"

type StatePanelProps = {
  icon: IconName
  title: string
  description: ReactNode
  action?: ReactNode
  tone?: "neutral" | "danger"
}

/** Centred message used for empty, no-results and error screens. */
function StatePanel({ icon, title, description, action, tone = "neutral" }: StatePanelProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface/40 px-6 py-16 text-center sm:py-24">
      <span
        className={cx(
          "grid size-14 place-items-center rounded-2xl ring-1 ring-inset",
          tone === "danger"
            ? "bg-rose-500/10 text-rose-300 ring-rose-400/20"
            : "bg-white/4 text-ink-muted ring-line-strong",
        )}
      >
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="mt-5 text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function EmptyLibrary() {
  return (
    <StatePanel
      icon="film"
      title="No videos yet"
      description="Videos uploaded to this studio will appear here, ready for you to review and publish."
    />
  )
}

export function NoResults({ search, onClear }: { search: string; onClear?: () => void }) {
  return (
    <StatePanel
      icon="searchX"
      title="No matching videos"
      description={
        search ? (
          <>
            Nothing matches <span className="font-semibold text-ink">“{search}”</span> with the current
            filters. Try a different title or clear the filters.
          </>
        ) : (
          "No videos match the current filters."
        )
      }
      action={
        <Button variant="secondary" icon="x" onClick={onClear}>
          Clear filters
        </Button>
      }
    />
  )
}

export function LibraryLoadError({
  title = "We couldn't load your library",
  onRetry,
  retrying = false,
}: {
  title?: string
  onRetry?: () => void
  retrying?: boolean
}) {
  return (
    <StatePanel
      tone="danger"
      icon="wifiOff"
      title={title}
      description="Check your connection and try again. Nothing has changed on your videos."
      action={
        <Button variant="primary" icon="refresh" loading={retrying} onClick={onRetry}>
          {retrying ? "Retrying…" : "Try again"}
        </Button>
      }
    />
  )
}
