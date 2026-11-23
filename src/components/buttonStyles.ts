import { cx } from "../lib/cx.ts"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-45"

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[0_10px_30px_-12px_rgb(255_77_109/0.8)] enabled:hover:bg-brand-strong disabled:shadow-none",
  secondary:
    "bg-white/6 text-ink ring-1 ring-inset ring-line-strong enabled:hover:bg-white/10",
  ghost: "text-ink-muted enabled:hover:bg-white/6 enabled:hover:text-ink",
  danger:
    "bg-rose-500/10 text-rose-200 ring-1 ring-inset ring-rose-400/25 enabled:hover:bg-rose-500/20",
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
}

/** Shared so links that look like buttons stay visually identical to real buttons. */
export function buttonClasses(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cx(base, variants[variant], sizes[size], className)
}
