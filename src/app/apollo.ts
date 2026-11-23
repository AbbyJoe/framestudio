import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

/**
 * Watched queries revalidate from the network so a cached Ready badge cannot linger.
 * Mutations keep Apollo's default errorPolicy of "none", so a GraphQL error
 * rejects instead of returning partial data. The screen waits for the server.
 */
export function createGraphQLClient() {
  return new ApolloClient({
    // Absolute URL so the same client works in the browser and in tests (Node's fetch needs one).
    link: new HttpLink({ uri: `${window.location.origin}/graphql` }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  })
}
