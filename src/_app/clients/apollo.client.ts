import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: `http://localhost:4001/graphql`,
  // uri: `https://graph-erp-api.graphland.dev/graphql`,
  cache: new InMemoryCache(),
});
