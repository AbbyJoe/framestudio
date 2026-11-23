export function DetailSkeleton() {
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
