import type { ReactNode } from "react"
import { Link, NavLink } from "react-router"
import { Icon } from "../components/Icon.tsx"
import { cx } from "../lib/cx.ts"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      {/* Soft brand glow behind the header. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_77_109/0.16),transparent_70%),radial-gradient(40%_40%_at_85%_10%,rgb(255_138_61/0.10),transparent_70%)]"
      />

      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-canvas/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-brand">
            <span className="grid size-8 place-items-center rounded-[10px] bg-linear-to-br from-brand to-brand-warm text-white shadow-[0_6px_20px_-6px_rgb(255_77_109/0.7)]">
              <Icon name="play" className="ml-0.5 size-3.5" />
            </span>
            <span className="text-[17px] font-extrabold tracking-tight text-ink">
              Frame<span className="text-ink-muted">Studio</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            <NavLink
              to="/"
              end={false}
              className={({ isActive }) =>
                cx(
                  "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition",
                  isActive ? "bg-white/7 text-ink" : "text-ink-muted hover:text-ink",
                )
              }
            >
              <Icon name="grid" className="size-4" />
              Library
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-right md:block">
              <span className="block text-xs font-bold text-ink">Northlight Studio</span>
              <span className="block text-[11px] text-ink-subtle">Operator</span>
            </span>
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white ring-2 ring-canvas"
            >
              NS
            </span>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-xs text-ink-subtle sm:px-6 lg:px-8">
          FrameStudio · Content operations
        </div>
      </footer>
    </div>
  )
}
