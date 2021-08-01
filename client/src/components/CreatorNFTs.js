import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/layout';
import NFT from './NFT';
import { Contract } from '@ethersproject/contracts';
import SocialStreamableNFT from '../contracts/SocialStreamableNFT.json';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { gql, useQuery } from '@apollo/client';
// import {clientAccounts} from '../index'
const GET2 = gql`
  query subb($creator: Bytes) {
    nfts(where: { creator: $creator }) {
      owner
      creator
      id
      uri
      royalty
    }
  }
`;
function CreatorNFTs(params) {
  const web3React = useWeb3React();
  let { id } = useParams();
  const [dataPoints, setDataPoints] = useState([]);
  const { loading, error, data } = useQuery(GET2, {
    variables: { creator: id },
  });

  useEffect(() => {
    if (data && !error & !loading) {
      setDataPoints(data.nfts);
    }
  }, [data]);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    console.log(error);
    return <div>error</div>;
  }
  if (data) {
    console.log(data);
  }

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
      {dataPoints.map(element => (
        <NFT
          key={element['id']}
          params={element}
          socialToken={params.socialToken}
          totalQuantity={params.totalQuantity}
        />
      ))}
    </SimpleGrid>
  );
}

export default CreatorNFTs;
