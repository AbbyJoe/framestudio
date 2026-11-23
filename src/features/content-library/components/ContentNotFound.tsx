import { Link } from "react-router"
import { buttonClasses } from "../../../components/buttonStyles.ts"
import { Icon } from "../../../components/Icon.tsx"

export function ContentNotFound() {
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
