import React from 'react';
import {
  Box,
  Text,
  Image,
  Tag,
  chakra,
  Flex,
  Spacer,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import MintNFT from '../components/MintNFT';
import CreatorNFTs from '../components/CreatorNFTs';

function CreatorPage(params) {
  let { id } = useParams();
  console.log(id);
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
          <MintNFT />
        </Box>
      </Flex>
      <Text fontSize="4xl">My NFTs</Text>
      <Flex height="full" padding="2" width="full" justifyContent="center">
        <CreatorNFTs />
      </Flex>
    </Flex>
  );
}

export default CreatorPage;
