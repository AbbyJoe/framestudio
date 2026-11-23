import { ApolloProvider } from "@apollo/client/react"
import { useState, type ReactNode } from "react"
import { createGraphQLClient } from "./apollo.ts"

export function AppProviders({ children }: { children: ReactNode }) {
  const [graphQLClient] = useState(() => createGraphQLClient())

  return <ApolloProvider client={graphQLClient}>{children}</ApolloProvider>
}
