import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Flex, Spacer } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import MintNFT from '../components/MintNFT';
import MintToken from '../components/MintToken';
import CreatorNFTs from '../components/CreatorNFTs';
import MainMintingContract from '../contracts/MainMintingContract.json';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { gql, useQuery } from '@apollo/client';
const GET2 = gql`
  query subb($owner: Bytes) {
    socialTokens(where: { owner: $owner }) {
      symbol
      id
      owner
      name
      totalQuantity
      address
    }
  }
`;

function CreatorPage(params) {
  let { id } = useParams();
  const web3React = useWeb3React();
  //Fetch data from the subgraph if the user has the tokens minted if minted then social token minting button is switched off
  const [dataPoints, setDataPoints] = useState([]);
  const { loading, error, data } = useQuery(GET2, {
    variables: { owner: id },
  });

  useEffect(() => {
    if (data && !error & !loading) {
      setDataPoints(data.socialTokens);
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
      MainMintingContract.networks[web3React.chainId].address,
      MainMintingContract.abi,
      web3React.library.getSigner()
    );
    contract.on(
      'SocialTokenCreated',
      (creatorAdd, _socialTokenAdd, name, symbol, TOTAL_SUPPLY) => {
        console.log(creatorAdd, _socialTokenAdd, name, symbol, TOTAL_SUPPLY);
        //Add code here to create the NFT in UI
      }
    );
  }

  const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';
  return (
    <Flex direction="column" width="full" height="full" alignItems="center">
      <Flex
        height="72"
        width="full"
        bgGradient="linear(to-r,gray.300,yellow.400,pink.200)"
        direction="row"
      >
        <Box
          padding="8"
          rounded={'lg'}
          pos={'relative'}
          height={'230px'}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={230}
            objectFit={'cover'}
            src={IMAGE}
            boxShadow={'2xl'}
          />
        </Box>
        <Box paddingY="8" experimental_spaceY="8">
          <Text fontSize="4xl">Prafful Sahu</Text>
          <Spacer />
          <Text>Here is something about me</Text>
          <Spacer />
          {web3React.active ? (
            <>
              {dataPoints.length > 0 ? (
                <MintNFT id={id} />
              ) : (
                <MintToken id={id} />
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Flex>
      <Text fontSize="4xl">My NFTs</Text>
      <Flex height="full" padding="2" width="full" justifyContent="center">
        <CreatorNFTs
          id={id}
          socialToken={dataPoints.length > 0 ? dataPoints[0].address : ''}
          totalQuantity={
            dataPoints.length > 0 ? dataPoints[0].totalQuantity : ''
          }
        />
      </Flex>
    </Flex>
  );
}

export default CreatorPage;
//Query to fetch the details of the creator
