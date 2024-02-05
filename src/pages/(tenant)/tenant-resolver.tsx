import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { Outlet, useParams } from "react-router-dom";

const apolloClientWithTenant = (tenant: string) => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${localStorage.getItem("erp:accessToken")}` || "",
      "x-tenant": tenant,
    },
  });
};

const TenantResolver: React.FC = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <ApolloProvider client={apolloClientWithTenant(params.tenant || "")}>
        <Outlet />
      </ApolloProvider>
    </>
  );
};

export default TenantResolver;
