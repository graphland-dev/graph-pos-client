import React from "react";
import ReactDOM from "react-dom/client";
import RootApp from "./RootApp";
import "./styles/styles.scss";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./_app/clients/apollo.client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <RootApp />
    </ApolloProvider>
  </React.StrictMode>
);
