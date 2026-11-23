import type { Content, ContentStatus } from "../../../content/publication.ts"
import { Icon } from "../../../components/Icon.tsx"
import { cx } from "../../../lib/cx.ts"
import { publicationActionFor, statusDetails, statusOrder } from "../utils/status.ts"
import { PublicationButton } from "./PublicationButton.tsx"
import { StatusBadge } from "./StatusBadge.tsx"

type PublicationPanelProps = {
  content: Content
  /** A publication request is in flight. */
  pending?: boolean
  /** The outcome of the last request is unknown and being checked. Actions wait. */
  checking?: boolean
  /** The status shown is the last confirmed one and may be out of date. */
  unconfirmed?: boolean
  onPublicationChange?: (published: boolean) => void
}

export function PublicationPanel({
  content,
  pending = false,
  checking = false,
  unconfirmed = false,
  onPublicationChange,
}: PublicationPanelProps) {
  const action = publicationActionFor(content.status)

  return (
    <section
      aria-labelledby="publication-heading"
      aria-busy={pending || checking || undefined}
      className="rounded-3xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="publication-heading" className="text-sm font-bold tracking-wide text-ink-muted uppercase">
          Publication
        </h2>
        {checking && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-300">
            <Icon name="loader" className="size-3.5 animate-spin" />
            Checking…
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={content.status} size="md" />
        {(unconfirmed || checking) && (
          <span className="text-xs font-medium text-ink-subtle">
            Last confirmed{unconfirmed && " · may be out of date"}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{statusDetails[content.status].summary}</p>

      <StatusTrack status={content.status} />

      <PublicationButton
        status={content.status}
        pending={pending}
        disabled={checking || unconfirmed}
        size="lg"
        className="mt-6 w-full"
        onChange={onPublicationChange}
      />
      <p className="mt-3 text-center text-xs leading-relaxed text-ink-subtle">
        {unconfirmed
          ? "Actions are paused until the latest status is confirmed."
          : action.hint}
      </p>
    </section>
  )
}

/** Draft → Ready → Published, with every step up to the current status lit. */
function StatusTrack({ status }: { status: ContentStatus }) {
  const currentIndex = statusOrder.indexOf(status)

  return (
    <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Publication progress">
      {statusOrder.map((step, index) => {
        const reached = index <= currentIndex
        const current = index === currentIndex

        return (
          <li key={step} aria-current={current ? "step" : undefined}>
            <span
              className={cx(
                "block h-1.5 rounded-full transition-colors",
                reached ? "bg-linear-to-r from-brand to-brand-warm" : "bg-white/8",
              )}
            />
            <span
              className={cx(
                "mt-2 block text-xs font-semibold",
                current ? "text-ink" : reached ? "text-ink-muted" : "text-ink-subtle",
              )}
            >
              {statusDetails[step].label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
