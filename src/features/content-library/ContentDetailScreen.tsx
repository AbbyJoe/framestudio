import { useQuery } from "@apollo/client/react"
import type { ReactNode } from "react"
import { Link, useParams } from "react-router"
import type { Content } from "../../content/publication.ts"
import { buttonClasses } from "../../components/buttonStyles.ts"
import { Icon } from "../../components/Icon.tsx"
import { findVideoQuery } from "../../graphql/queries.ts"
import { ContentHero, ContentMetadata } from "./components/ContentDetails.tsx"
import { LibraryLoadError } from "./components/LibraryStates.tsx"
import { PublicationNoticeBanner } from "./components/PublicationNotices.tsx"
import { PublicationPanel } from "./components/PublicationPanel.tsx"
import { ScenarioPanel } from "./components/ScenarioPanel.tsx"
import { usePublication } from "./hooks/usePublication.ts"

/** Loads one video, then hands it to ContentView. */
export function ContentDetailScreen() {
  const { id = "" } = useParams()
  const { data, loading, error, refetch } = useQuery(findVideoQuery, { variables: { id } })

  if (data === undefined) {
    return (
      <DetailLayout>
        {error ? (
          <LibraryLoadError
            title="We couldn't load this video"
            retrying={loading}
            onRetry={() => refetch().catch(() => {})}
          />
        ) : (
          <DetailSkeleton />
        )}
      </DetailLayout>
    )
  }

  if (data.content === null) {
    return (
      <DetailLayout>
        <ContentNotFound />
      </DetailLayout>
    )
  }

  // key resets the publication state when navigating to a different video.
  return <ContentView key={data.content.id} content={data.content} />
}

function ContentView({ content }: { content: Content }) {
  const publication = usePublication(content)

  return (
    <DetailLayout>
      {publication.notice && (
        <div className="mb-6">
          <PublicationNoticeBanner
            notice={publication.notice}
            onDismiss={publication.dismissNotice}
            onCheckAgain={publication.checkLatestStatus}
          />
        </div>
      )}

      {/* Mobile order: hero, publication, details. Desktop: publication pinned in the right column. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10">
        <ContentHero content={content} />
        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <PublicationPanel
            content={content}
            pending={publication.isSaving}
            checking={publication.isChecking}
            unconfirmed={publication.isUnconfirmed}
            onPublicationChange={publication.updatePublication}
          />
        </aside>
        <ContentMetadata content={content} />
      </div>

      <ScenarioPanel content={content} />
    </DetailLayout>
  )
}

function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full py-1 text-sm font-semibold text-ink-muted transition hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Icon name="arrowLeft" className="size-4" />
        Content Library
      </Link>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading video" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <div aria-hidden="true">
        <div className="aspect-video animate-pulse rounded-3xl bg-white/4" />
        <div className="mt-6 h-5 w-48 animate-pulse rounded-full bg-white/6" />
        <div className="mt-4 h-9 w-3/4 animate-pulse rounded-full bg-white/6" />
        <div className="mt-8 h-32 animate-pulse rounded-2xl bg-white/4" />
      </div>
      <div aria-hidden="true" className="h-80 animate-pulse rounded-3xl bg-white/4" />
    </div>
  )
}

function ContentNotFound() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface/40 px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-white/4 text-ink-muted ring-1 ring-inset ring-line-strong">
        <Icon name="searchX" className="size-6" />
      </span>
      <h1 className="mt-5 text-lg font-bold text-ink">Video not found</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        This video may have been removed, or the link is incorrect.
      </p>
      <Link to="/" className={buttonClasses("secondary", "md", "mt-6")}>
        <Icon name="grid" className="size-4" />
        Back to library
      </Link>
    </div>
  )
}
