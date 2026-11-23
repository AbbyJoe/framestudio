import { useState } from "react"
import type { Content } from "../../../content/publication.ts"
import { Icon } from "../../../components/Icon.tsx"
import { cx } from "../../../lib/cx.ts"
import { updateVideoStatus } from "../../../mocks/database.ts"
import { dropNextSavedReply, isBackendOffline, setBackendOffline } from "../../../mocks/services.ts"

/**
 * DEV ONLY. Changes the mock backend behind the screen's back, so reviewers can
 * reproduce the assessment scenarios by hand. Hidden in production builds.
 */
export function ScenarioPanel({ content }: { content?: Content }) {
  const [isOpen, setIsOpen] = useState(false)
  const [offline, setOffline] = useState(isBackendOffline)
  const [lastAction, setLastAction] = useState<string | null>(null)

  if (!import.meta.env.DEV) return null

  function simulateOtherOperator() {
    if (!content) return
    // Writes straight to the mock database. This screen still shows the old status, as it would in real life.
    updateVideoStatus(content.id, "DRAFT")
    setLastAction("Another operator moved this video to Draft. Now try to publish it.")
  }

  function loseNextReply() {
    dropNextSavedReply()
    setLastAction("The next successful save will lose its reply. Now publish or unpublish.")
  }

  function toggleOffline() {
    setBackendOffline(!offline)
    setOffline(!offline)
    setLastAction(!offline ? "Server is unreachable. Every request will fail." : "Server is reachable again.")
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      {isOpen && (
        <div className="w-80 max-w-full rounded-2xl border border-line-strong bg-surface-raised/95 p-4 text-sm shadow-2xl shadow-black/60 backdrop-blur-md">
          <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">Test scenarios</p>
          <div className="mt-3 flex flex-col gap-2">
            {content && (
              <ScenarioButton
                label="A · Another operator moves it to Draft"
                disabled={content.status !== "READY"}
                onClick={simulateOtherOperator}
              />
            )}
            {content && <ScenarioButton label="B · Lose the reply to the next save" onClick={loseNextReply} />}
            <ScenarioButton
              label={offline ? "Bring the server back online" : "Take the server offline"}
              active={offline}
              onClick={toggleOffline}
            />
          </div>
          {lastAction && <p className="mt-3 text-xs leading-relaxed text-ink-muted">{lastAction}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised/90 px-3 py-2 text-xs font-semibold text-ink-muted shadow-2xl shadow-black/50 backdrop-blur-md hover:text-ink"
      >
        <Icon name="sliders" className="size-3.5" />
        Test scenarios
        {offline && <span className="size-1.5 rounded-full bg-rose-400" aria-label="Server offline" />}
      </button>
    </div>
  )
}

function ScenarioButton({
  label,
  onClick,
  disabled = false,
  active = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "rounded-xl px-3 py-2 text-left text-xs font-semibold ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-rose-500/15 text-rose-200 ring-rose-400/30"
          : "bg-white/5 text-ink ring-line enabled:hover:bg-white/10",
      )}
    >
      {label}
    </button>
  )
}
