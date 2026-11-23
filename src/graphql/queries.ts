import { gql, type TypedDocumentNode } from "@apollo/client"
import type { Content, ContentStatus } from "../content/publication.ts"
import { videoFields } from "./videoFields.ts"

export type ListVideosData = { contents: Content[] }
export type ListVideosVariables = { search: string | null; status: ContentStatus | null }

export const listVideosQuery: TypedDocumentNode<ListVideosData, ListVideosVariables> = gql`
  query Contents($search: String, $status: ContentStatus) {
    contents(search: $search, status: $status) {
      ...ContentFields
    }
  }
  ${videoFields}
`

export type FindVideoData = { content: Content | null }
export type FindVideoVariables = { id: string }

export const findVideoQuery: TypedDocumentNode<FindVideoData, FindVideoVariables> = gql`
  query Content($id: ID!) {
    content(id: $id) {
      ...ContentFields
    }
  }
  ${videoFields}
`
