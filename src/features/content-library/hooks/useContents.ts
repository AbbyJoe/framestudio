import { useQuery } from "@apollo/client/react"
import { useState } from "react"
import type { ContentStatus } from "../../../content/publication.ts"
import { listVideosQuery } from "../../../graphql/queries.ts"
import { useDebouncedValue } from "./useDebouncedValue.ts"

/**
 * Loads the content library and keeps search/filter as local UI state.
 * Filtering is delegated to the GraphQL API via query variables.
 */
export function useContents() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ContentStatus | null>(null)
  const debouncedSearch = useDebouncedValue(search.trim())

  // Search and filtering happen on the server, so this keeps working when the library grows.
  const { data, previousData, loading, error, refetch } = useQuery(listVideosQuery, {
    variables: { search: debouncedSearch || null, status },
  })

  // While new results load, keep showing the previous ones instead of flashing a skeleton.
  const videos = data?.contents ?? previousData?.contents
  const isFiltering = debouncedSearch !== "" || status !== null
  const isRefreshing = loading && videos !== undefined

  function clearFilters() {
    setSearch("")
    setStatus(null)
  }

  return {
    search,
    setSearch,
    status,
    setStatus,
    debouncedSearch,
    clearFilters,
    videos,
    loading,
    error,
    isFiltering,
    isRefreshing,
    refetch,
  }
}
