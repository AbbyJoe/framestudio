import type { ContentStatus } from "../../../content/publication.ts"
import { Button } from "../../../components/Button.tsx"
import type { ButtonSize } from "../../../components/buttonStyles.ts"
import { publicationActionFor } from "../utils/status.ts"

type PublicationButtonProps = {
  status: ContentStatus
  /** A publication request for this video is in flight. */
  pending?: boolean
  /** Block the action for another reason, e.g. while the latest status is being checked. */
  disabled?: boolean
  size?: ButtonSize
  className?: string
  /** true means Publish, false means Unpublish. Matches the setPublication mutation. */
  onChange?: (published: boolean) => void
}

export function PublicationButton({
  status,
  pending = false,
  disabled = false,
  size = "md",
  className,
  onChange,
}: PublicationButtonProps) {
  const action = publicationActionFor(status)

  if (action.kind === "none") {
    return (
      <Button size={size} variant="ghost" icon="pencil" disabled className={className} title={action.hint}>
        {action.label}
      </Button>
    )
  }

  const publishes = action.kind === "publish"

  return (
    <Button
      size={size}
      variant={publishes ? "primary" : "secondary"}
      icon={publishes ? "send" : "eyeOff"}
      loading={pending}
      disabled={disabled}
      className={className}
      onClick={() => onChange?.(publishes)}
    >
      {pending ? action.pendingLabel : action.label}
    </Button>
  )
}
