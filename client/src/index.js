import { theme, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// export const clientNFT = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_NFT, //"http://localhost:8000/subgraphs/name/iamsahu/idatest",
//   cache: new InMemoryCache(),
// });

// export const clientAccounts = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_ACCOUNTS, //"http://localhost:8000/subgraphs/name/iamsahu/idatest",
//   cache: new InMemoryCache(),
//   headers: {
//     'content-type': 'application/json',
//     'x-hasura-admin-secret': process.env.REACT_APP_GRAPHQL_ACCOUNTS_SECRET,
//   },
// });

// export const clientSocialToken = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_SOCIALTOKEN, //"http://localhost:8000/subgraphs/name/iamsahu/idatest",
//   cache: new InMemoryCache(),
// });

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_NFT, //"http://localhost:8000/subgraphs/name/iamsahu/idatest",
  cache: new InMemoryCache(),
});

function getLibrary(provider, connector) {
  // return new ethers.providers.Web3Provider(window.ethereum);
  const test = new Web3Provider(provider);

  return test; // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <ColorModeScript />
          <App />
        </ChakraProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
