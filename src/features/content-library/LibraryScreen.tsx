import { Button } from "../../components/Button.tsx"
import { ContentFilters } from "./components/ContentFilters.tsx"
import { ContentList, ContentListSkeleton } from "./components/ContentList.tsx"
import { EmptyLibrary, LibraryLoadError, NoResults } from "./components/LibraryStates.tsx"
import { Notice } from "./components/Notice.tsx"
import { ScenarioPanel } from "./components/ScenarioPanel.tsx"
import { useContents } from "./hooks/useContents.ts"

export function LibraryScreen() {
  const {
    search,
    setSearch,
    status,
    setStatus,
    debouncedSearch,
    clearFilters,
    videos,
    loading,
    error,
    isFiltering,
    isRefreshing,
    refetch,
  } = useContents()

  function reloadVideos() {
    // A failure is already shown through `error`, so the rejected promise needs no handling here.
    refetch().catch(() => {})
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">Studio</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-[2.75rem] sm:leading-tight">
            Content Library
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted sm:text-base">
            Manage your videos and control what your audience can watch.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon="refresh"
          loading={isRefreshing}
          onClick={reloadVideos}
          className="self-start sm:self-auto"
        >
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </header>

      <div className="mt-8">
        <ContentFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      </div>

      {error && videos && (
        <Notice
          tone="danger"
          title="Couldn't refresh your library"
          className="mt-6"
          actions={
            <Button size="sm" variant="secondary" icon="refresh" onClick={reloadVideos}>
              Retry
            </Button>
          }
        >
          You're seeing videos from your last successful load. Statuses may have changed since then.
        </Notice>
      )}

      <section className="mt-6" aria-live="polite">
        {videos === undefined ? (
          error ? (
            <LibraryLoadError onRetry={reloadVideos} retrying={loading} />
          ) : (
            <ContentListSkeleton />
          )
        ) : videos.length === 0 ? (
          isFiltering ? (
            <NoResults search={debouncedSearch} onClear={clearFilters} />
          ) : (
            <EmptyLibrary />
          )
        ) : (
          <>
            <p className="mb-4 text-xs font-medium text-ink-subtle">
              Showing {videos.length} {videos.length === 1 ? "video" : "videos"}
            </p>
            <ContentList contents={videos} />
          </>
        )}
      </section>

      <ScenarioPanel />
    </div>
  )
}
