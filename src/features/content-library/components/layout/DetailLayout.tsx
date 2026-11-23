import type { ReactNode } from "react"
import { Link } from "react-router"
import { Icon } from "../../../../components/Icon.tsx"

export function DetailLayout({ children }: { children: ReactNode }) {
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
