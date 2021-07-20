import React from 'react';
import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

function MintToken(params) {
  const web3React = useWeb3React();
  return <Button>Mint Token</Button>;
}

export default MintToken;

//TODO:
// Check on load if social token has been minted
// If minted than show the stats
// if not minted than show the option of minting
