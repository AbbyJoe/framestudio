import { CombinedGraphQLErrors } from "@apollo/client"
import { useApolloClient, useMutation } from "@apollo/client/react"
import { useState } from "react"
import {
  readPublicationReply,
  type Content,
  type ContentStatus,
  type ServerError,
} from "../../../content/publication.ts"
import { changePublicationMutation } from "../../../graphql/mutations.ts"
import { findVideoQuery } from "../../../graphql/queries.ts"
import { videoFields } from "../../../graphql/videoFields.ts"

/** What the operator should be told about their last publication request. */
export type PublicationNotice =
  | { kind: "saved"; status: ContentStatus }
  | { kind: "conflict"; previousStatus: ContentStatus; currentStatus: ContentStatus; message: string }
  /** Reply never arrived — tell the operator, then reconcile in the background. */
  | { kind: "unknown"; message: string }
  /** Operator asked to check again — show that a confirm is in progress. */
  | { kind: "checking" }
  | { kind: "confirmed"; status: ContentStatus }
  | { kind: "unconfirmed" }
  | { kind: "failed"; message: string }

/**
 * Publishes or unpublishes one video, and never shows a status the server hasn't confirmed.
 *
 * - Success: Apollo writes the returned video into its cache, so every screen shows the new status.
 * - Rejected (Scenario A): the server sends back the video's real status. We show it and explain.
 * - No reply (Scenario B): show an unknown notice, then silently ask the server for the real status.
 */
export function usePublication(content: Content) {
  const apolloClient = useApolloClient()
  const [sendPublicationChange, { loading: isSaving }] = useMutation(changePublicationMutation)
  const [notice, setNotice] = useState<PublicationNotice | null>(null)

  /**
   * Asks the server for the video's real status.
   * `silent` keeps the current notice (e.g. unknown) instead of swapping to "checking".
   */
  async function checkLatestStatus(options?: { silent?: boolean }) {
    if (!options?.silent) setNotice({ kind: "checking" })

    try {
      // A one-off query, so a failure here doesn't wipe the status already on screen.
      const { data } = await apolloClient.query({
        query: findVideoQuery,
        variables: { id: content.id },
        fetchPolicy: "network-only",
      })
      const latestVideo = data?.content

      if (latestVideo) {
        setNotice({ kind: "confirmed", status: latestVideo.status })
      } else {
        setNotice({ kind: "failed", message: "This video no longer exists." })
      }
    } catch {
      setNotice({ kind: "unconfirmed" })
    }
  }

  /** true publishes, false unpublishes. */
  async function updatePublication(published: boolean) {
    if (isSaving) return

    const statusBeforeRequest = content.status
    setNotice(null)

    try {
      const { data } = await sendPublicationChange({ variables: { id: content.id, published } })
      if (data) setNotice({ kind: "saved", status: data.setPublication.status })
    } catch (error) {
      // A GraphQL error means the server answered. Anything else means the reply was lost.
      const serverAnswered = CombinedGraphQLErrors.is(error)
      const reply = readPublicationReply({
        replyNeverArrived: !serverAnswered,
        serverErrors: serverAnswered ? (error.errors as ServerError[]) : [],
      })

      if (reply.result === "rejected") {
        showServerVersion(reply.video)
        setNotice({
          kind: "conflict",
          previousStatus: statusBeforeRequest,
          currentStatus: reply.video.status,
          message: reply.message,
        })
      } else if (reply.result === "unknown") {
        // Tell the operator first; reconcile without replacing that notice with "checking".
        setNotice({ kind: "unknown", message: reply.message })
        void checkLatestStatus({ silent: true })
      } else {
        setNotice({ kind: "failed", message: reply.message })
      }
    }
  }

  /** Puts the server's copy of the video into the cache, which updates every screen showing it. */
  function showServerVersion(video: Content) {
    apolloClient.writeFragment({
      id: apolloClient.cache.identify({ __typename: "Content", id: video.id }),
      fragment: videoFields,
      fragmentName: "ContentFields",
      data: { __typename: "Content", ...video },
    })
  }

  return {
    notice,
    isSaving,
    // Pause actions while unknown is up (silent refetch) or while an explicit check runs.
    isChecking: notice?.kind === "checking" || notice?.kind === "unknown",
    isUnconfirmed: notice?.kind === "unconfirmed",
    updatePublication,
    checkLatestStatus: () => checkLatestStatus(),
    dismissNotice: () => setNotice(null),
  }
}
