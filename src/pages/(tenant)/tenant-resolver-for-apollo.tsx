import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL ?? '';

const apolloClientWithTenant = (tenant: string) => {
  return new ApolloClient({
    uri: `${apiUrl}/graphql`,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${localStorage.getItem('erp:accessToken')}` || '',
      'x-tenant': tenant,
    },
  });
};

const TenantResolverForApollo: React.FC = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <ApolloProvider client={apolloClientWithTenant(params.tenant || '')}>
        <Outlet />
      </ApolloProvider>
    </>
  );
};

export default TenantResolverForApollo;
