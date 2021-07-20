import React from 'react';
import { Flex } from '@chakra-ui/react';
import OwnerNFTs from '../components/OwnerNFTs';

function NFTOwnerPage(params) {
  return (
    <Flex width="full" justifyContent="center">
      <OwnerNFTs />
    </Flex>
  );
}

export default NFTOwnerPage;
