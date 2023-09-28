import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import { apolloClient } from './_app/clients/apollo.client';
import './styles/styles.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ApolloProvider client={apolloClient}>
			<RootApp />
		</ApolloProvider>
	</React.StrictMode>
);
