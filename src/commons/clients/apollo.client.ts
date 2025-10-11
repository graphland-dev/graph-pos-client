import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { TokenService } from "../utils/TokenService";
import { errorLink } from "./errorLink";

const removeTypenameLink = removeTypenameFromVariables();

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${TokenService.getToken()}` || "",
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, removeTypenameLink, authMiddleware, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
