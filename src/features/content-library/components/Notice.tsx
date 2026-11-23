import type { ReactNode } from "react"
import { Icon, type IconName } from "../../../components/Icon.tsx"
import { cx } from "../../../lib/cx.ts"

type NoticeTone = "info" | "warning" | "danger" | "success"

const tones: Record<NoticeTone, { container: string; icon: string; defaultIcon: IconName }> = {
  info: { container: "border-sky-400/20 bg-sky-400/6", icon: "text-sky-300", defaultIcon: "info" },
  warning: { container: "border-amber-400/25 bg-amber-400/7", icon: "text-amber-300", defaultIcon: "alert" },
  danger: { container: "border-rose-400/25 bg-rose-500/8", icon: "text-rose-300", defaultIcon: "wifiOff" },
  success: { container: "border-emerald-400/20 bg-emerald-400/6", icon: "text-emerald-300", defaultIcon: "check" },
}

type NoticeProps = {
  tone: NoticeTone
  title: string
  children?: ReactNode
  icon?: IconName
  /** Spins the icon to show work is still happening. */
  busy?: boolean
  actions?: ReactNode
  className?: string
}

export function Notice({ tone, title, children, icon, busy = false, actions, className }: NoticeProps) {
  const style = tones[tone]
  const urgent = tone === "danger" || tone === "warning"

  return (
    <div
      role={urgent ? "alert" : "status"}
      className={cx(
        "flex flex-wrap items-start gap-x-4 gap-y-3 rounded-2xl border p-4 sm:flex-nowrap sm:p-5",
        style.container,
        className,
      )}
    >
      <span className={cx("grid size-9 shrink-0 place-items-center rounded-full bg-white/6", style.icon)}>
        <Icon
          name={busy ? "loader" : (icon ?? style.defaultIcon)}
          className={cx("size-[18px]", busy && "animate-spin")}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed text-ink-muted">{children}</div>}
      </div>
      {/* On small screens actions drop below the text, aligned with it (icon 36px + gap 16px). */}
      {actions && (
        <div className="flex w-full flex-wrap gap-2 pl-13 sm:w-auto sm:shrink-0 sm:self-center sm:pl-0">
          {actions}
        </div>
      )}
    </div>
  )
}
