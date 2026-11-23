import { gql, type TypedDocumentNode } from "@apollo/client"
import type { Content } from "../content/publication.ts"
import { videoFields } from "./videoFields.ts"

export type ChangePublicationData = { setPublication: Content }
export type ChangePublicationVariables = { id: string; published: boolean }

export const changePublicationMutation: TypedDocumentNode<
  ChangePublicationData,
  ChangePublicationVariables
> = gql`
  mutation SetPublication($id: ID!, $published: Boolean!) {
    setPublication(id: $id, published: $published) {
      ...ContentFields
    }
  }
  ${videoFields}
`
