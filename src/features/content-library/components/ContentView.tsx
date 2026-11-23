import type { Content } from "../../../content/publication.ts"
import { usePublication } from "../hooks/usePublication.ts"
import { ContentHero, ContentMetadata } from "./ContentDetails.tsx"
import { DetailLayout } from "./layout/DetailLayout.tsx"
import { PublicationNoticeBanner } from "./PublicationNotices.tsx"
import { PublicationPanel } from "./PublicationPanel.tsx"
import { ScenarioPanel } from "./ScenarioPanel.tsx"

export function ContentView({ content }: { content: Content }) {
  const publication = usePublication(content)

  return (
    <DetailLayout>
      {publication.notice && (
        <div className="mb-6">
          <PublicationNoticeBanner
            notice={publication.notice}
            onDismiss={publication.dismissNotice}
            onCheckAgain={publication.checkLatestStatus}
          />
        </div>
      )}

      {/* Mobile order: hero, publication, details. Desktop: publication pinned in the right column. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10">
        <ContentHero content={content} />
        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <PublicationPanel
            content={content}
            pending={publication.isSaving}
            checking={publication.isChecking}
            unconfirmed={publication.isUnconfirmed}
            onPublicationChange={publication.updatePublication}
          />
        </aside>
        <ContentMetadata content={content} />
      </div>

      <ScenarioPanel content={content} />
    </DetailLayout>
  )
}
