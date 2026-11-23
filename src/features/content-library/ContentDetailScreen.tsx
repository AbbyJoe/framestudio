import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router"
import { findVideoQuery } from "../../graphql/queries.ts"
import { ContentNotFound } from "./components/ContentNotFound.tsx"
import { ContentView } from "./components/ContentView.tsx"
import { DetailSkeleton } from "./components/DetailSkeleton.tsx"
import { DetailLayout } from "./components/layout/DetailLayout.tsx"
import { LibraryLoadError } from "./components/LibraryStates.tsx"

/** Loads one video, then hands it to ContentView. */
export function ContentDetailScreen() {
  const { id = "" } = useParams()
  const { data, loading, error, refetch } = useQuery(findVideoQuery, { variables: { id } })

  if (data === undefined) {
    return (
      <DetailLayout>
        {error ? (
          <LibraryLoadError
            title="We couldn't load this video"
            retrying={loading}
            onRetry={() => refetch().catch(() => {})}
          />
        ) : (
          <DetailSkeleton />
        )}
      </DetailLayout>
    )
  }

  if (data.content === null) {
    return (
      <DetailLayout>
        <ContentNotFound />
      </DetailLayout>
    )
  }

  return <ContentView key={data.content.id} content={data.content} />
}
