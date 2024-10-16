//REACT
import ReactDOM from "react-dom/client";
//ROUTING
import { BrowserRouter, HashRouter } from "react-router-dom";
import "./assets/scss/style.scss";
//APP
import App from "./App";
//APOLLO
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

import getToken from "./utils/getToken";
import { StrictMode } from "react";
import { graphDataSource } from "./api/datasources";

const container = document.getElementById( "root") as HTMLDivElement;
const root = ReactDOM.createRoot(container);
const httpLink = new HttpLink({ uri: graphDataSource() });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = getToken();
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

root.render(
  <StrictMode>
    <HashRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </HashRouter>
  </StrictMode>
);
