import { TokenService } from "@/commons/utils/TokenService";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ShieldXIcon, XIcon } from "lucide-react";
import React, { useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

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

const TenantResolverForApollo: React.FC = () => {
  const [errors, setErrors] = useImmer<
    {
      path: string;
      message: string;
    }[]
  >([]);
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant || "";

  const errorLink = useMemo(
    () =>
      onError(({ graphQLErrors, networkError, operation }) => {
        console.log("🔴 ErrorLink triggered!");
        console.log("Operation:", operation.operationName);
        console.log("GraphQL Errors:", graphQLErrors);
        console.log("Network Error:", networkError);

        graphQLErrors?.forEach((error) => {
          const { message, extensions, path } = error;
          const errorCode = extensions?.code as string;
          // Check if error is permission/authorization related
          const isPermissionError =
            errorCode === "FORBIDDEN" ||
            errorCode === "UNAUTHENTICATED" ||
            errorCode === "UNAUTHORIZED";

          if (isPermissionError) {
            setErrors((draft) => {
              draft.push({
                path: path?.join(" > ") || "",
                message: message || "Permission Error",
              });
            });
          }
        });

        // setErrors({ graphQLErrors, networkError, operation });
      }),
    [setErrors]
  );

  // Inject current tenant header without recreating the client each render
  const tenantLink = useMemo(
    () =>
      new ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            "x-tenant": tenant,
          },
        }));
        return forward(operation);
      }),
    [tenant]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        link: from([tenantLink, authMiddleware, errorLink, httpLink]),
        cache: new InMemoryCache({ addTypename: false }),
      }),
    [tenantLink, errorLink]
  );

  return (
    <ApolloProvider client={client}>
      {errors.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[500] border-b border-red-500 shadow-lg bg-red-500">
          <div className="container px-4 py-3 mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldXIcon className="text-white" />
                  <h3 className="text-sm font-semibold text-white">
                    Permission Error{errors.length > 1 ? "s" : ""}
                  </h3>
                </div>

                <div className="space-y-5 text-white">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{error.message}</p>
                      {error.path && <p className="mt-1">Path: {error.path}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setErrors([])}
                className="flex-shrink-0"
                aria-label="Dismiss errors"
              >
                <XIcon className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </ApolloProvider>
  );
};

export default TenantResolverForApollo;
