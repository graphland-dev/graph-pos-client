import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";

const removeTypenameLink = removeTypenameFromVariables();

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem("erp:accessToken")}` || "",
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([removeTypenameLink, authMiddleware, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  headers: {
    authorization: `Bearer ${localStorage.getItem("erp:accessToken")}` || "",
  },
});
