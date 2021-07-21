import React from 'react';
import { Button } from '@chakra-ui/react';

function MintNFT(params) {
  return <Button alignSelf="flex-end">Mint a NFT!</Button>;
}

export default MintNFT;

//Check if the page is of the user who is signed in metamask & if yes then show the button else not
