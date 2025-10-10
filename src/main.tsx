import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import RootApp from './RootApp';
import { apolloClient } from '@/commons/clients/apollo.client';
// import './styles/styles.scss';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <RootApp />
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
