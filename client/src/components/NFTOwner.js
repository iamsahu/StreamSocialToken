import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
} from '@chakra-ui/react';
import TransferNFT from './TransferNFT';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

export default function NFTOwner(props) {
  let { id } = useParams();
  const web3React = useWeb3React();

  console.log(props);
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${props.props.uri})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={props.props.uri}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text
            color={'gray.500'}
            fontSize={'sm'}
            textTransform={'uppercase'}
            isTruncated={true}
            noOfLines={2}
          ></Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {props.props.id}
          </Heading>
          <Stack direction={'row'} align={'center'}>
            {web3React.active ? (
              web3React.account.toLowerCase() == id.toLowerCase() ? (
                <TransferNFT />
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </Stack>
          <Stack direction={'row'} align={'center'}>
            <Text
              fontWeight={100}
              fontSize={'small'}
              align={'center'}
              noOfLines={4}
            >
              Access to {props.props.royalty}% of {props.props.creator}'s token
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
