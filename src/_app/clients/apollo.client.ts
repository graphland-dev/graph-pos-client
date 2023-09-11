import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: `https://graph-erp-api.graphland.dev/graphql`,
  cache: new InMemoryCache(),
});
