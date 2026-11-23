import { gql } from "@apollo/client"

export const videoFields = gql`
  fragment ContentFields on Content {
    id
    title
    thumbnailUrl
    durationSeconds
    uploadedAt
    status
  }
`
