import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
  cache: new InMemoryCache(),
});
