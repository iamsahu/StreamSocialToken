import React from 'react';
import { useParams } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/layout';
import NFT from './NFT';
import { Contract } from '@ethersproject/contracts';
import SocialStreamableNFT from '../contracts/SocialStreamableNFT.json';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
// import {clientAccounts} from '../index'

function CreatorNFTs(params) {
  const web3React = useWeb3React();
  let { id } = useParams();
  if (web3React.active) {
    const contract = new Contract(
      SocialStreamableNFT.networks[web3React.chainId].address,
      SocialStreamableNFT.abi,
      web3React.library.getSigner()
    );
    contract.on('Transfer', (to, amount, from) => {
      console.log(to, amount, from);
    });
  }
  //Need to pass the flow state for the NFTs
  return (
    <SimpleGrid columns={3} spacing={10} alignSelf="center">
      <NFT id={id} />
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
