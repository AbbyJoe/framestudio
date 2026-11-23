import type { ComponentProps } from "react"
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles.ts"
import { Icon, type IconName } from "./Icon.tsx"

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName
  /** Shows a spinner and blocks further clicks while a request is in flight. */
  loading?: boolean
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Icon name="loader" className="size-4 animate-spin" />
      ) : icon ? (
        <Icon name={icon} className="size-4" />
      ) : null}
      {children}
    </button>
  )
}
