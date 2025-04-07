import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import { apolloClient } from '@/commons/clients/apollo.client';
import { MantineProvider } from '@mantine/core';

import '@mantine/spotlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <MantineProvider>
        <RootApp />
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
