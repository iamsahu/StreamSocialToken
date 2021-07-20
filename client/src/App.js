import React, { useRef, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from './helpers/connector';
import Web3 from 'web3';
import { Box, Tag, chakra, Flex, Button } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreatorPage from './pages/CreatorPage';
import NFTOwnerPage from './pages/NFTOwnerPage';

function App() {
  const web3React = useWeb3React();
  const [metaMask, setMetaMask] = useState('');
  const details = useRef({
    web3: null,
    accounts: [],
    ethereum: null,
    chainid: 0,
  });

  const activateWeb3 = () => {
    web3React
      .activate(injected, onError, true)
      .then(response => {
        //Check for whether it is an existing account
        //If it is an existing, based on the role provide the options
        console.log(response);
        console.log(web3React.account);
      })
      .catch(err => {
        console.error(err);

        // debugger;
      });
  };

  useEffect(() => {
    if (typeof web3React.connector != 'undefined')
      web3React.connector.getProvider().then(provider => {
        const web3 = new Web3(provider);
        details.current.web3 = web3;
        details.current.chainid = web3React.chainId;
        setMetaMask('GotWeb3');
        provider.on('chainChanged', handleChainChanged);
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('close', handleClose);
        provider.on('networkChanged', handleNetworkChanged);
      });
  }, [web3React.active, web3React.connector]);

  useEffect(() => {
    if (details.current.web3 === null) {
      return;
    }
    // const networkId = details.current.chainid;
    // // console.log(networkId);
    // const cc = ERC777Distributor.networks[web3React.chainId];
    // // console.log(cc);
    // const local1nstance = new details.current.web3.eth.Contract(
    //   ERC777Distributor.abi,
    //   cc.address
    // );
    // // const con = new Contract(
    // // 	ERC777Distributor.networks[web3React.chainId].address,
    // // 	ERC777Distributor.abi,
    // // 	web3React.library.getSigner()
    // // );
    // details.current.mainContract = local1nstance;
    details.current.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        debugger;
        console.error(err);
      } else {
        if (accounts.length > 0) {
          details.current.accounts = accounts[0];
          setMetaMask('Set');
        }
      }
    });
  }, [details.current.web3]);

  //TO DO: Handling the following

  function handleChainChanged(chainId) {
    details.current.chainid = chainId;
    window.location.reload();
    activateWeb3();
  }
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      details.current.accounts = accounts;
    } else {
      details.current.accounts = accounts;
      setMetaMask('');
    }
  }
  function handleClose() {
    setMetaMask('');
  }
  function handleNetworkChanged() {}

  async function ConnectWallet() {
    activateWeb3();
  }
  const onError = err => {
    console.error(err);
    // debugger;
  };

  return (
    <Router>
      <Box>
        <chakra.header
          bg="red.300"
          w="full"
          px={{ base: 2, sm: 4 }}
          py={4}
          h="16"
          shadow="md"
        >
          <Flex justifyContent="space-between" mx="auto">
            <Flex>
              <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                STREAMABLE SOCIAL TOKEN
              </chakra.h1>
            </Flex>
            {web3React.account !== undefined ? (
              <Tag variant="solid" colorScheme="teal">
                {web3React.account}
              </Tag>
            ) : (
              <Button
                type="primary"
                onClick={ConnectWallet}
                justifySelf="flex-end"
              >
                Connect Wallet
              </Button>
            )}

            <ColorModeSwitcher justifySelf="flex-end" />
          </Flex>
        </chakra.header>
        <Flex align="center">
          <Switch>
            <Route path="/nftowner/:id">
              <NFTOwnerPage />
            </Route>
            <Route path="/creator/:id">
              <CreatorPage />
            </Route>
            <Route path="/">
              <LandingPage />
            </Route>
          </Switch>
        </Flex>
      </Box>
    </Router>
  );
}

export default App;
