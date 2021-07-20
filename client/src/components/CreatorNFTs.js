import React from 'react';
import { useParams } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/layout';
import NFT from './NFT';

function CreatorNFTs(params) {
  let { id } = useParams();

  return (
    <SimpleGrid columns={3} spacing={10} alignSelf="center">
      <NFT owner={id} />
      <NFT />
      <NFT />
      <NFT />
      <NFT />
      <NFT />
      <NFT />
    </SimpleGrid>
  );
}

export default CreatorNFTs;
//Fire a query to get all the nfts created by the owner and display them
