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
import Stream from './Stream';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import TransferNFT from './TransferNFT';
const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

export default function NFT(props) {
  let { id } = useParams();
  const web3React = useWeb3React();
  console.log(props);
  console.log(props.params.owner);
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
            backgroundImage: `url(${props.params.uri})`,
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
            src={props.params.uri}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          {/* <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Creator
          </Text> */}
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {props.params.id}
          </Heading>
          <Stack direction={'row'} align={'center'}>
            {web3React.active ? (
              web3React.account == id ? (
                <>
                  {props.params.owner !== id.toLowerCase() ? (
                    <Stream
                      id={props.params.id}
                      socialToken={props.socialToken}
                      totalQuantity={props.totalQuantity}
                      royalty={props.params.royalty}
                    />
                  ) : (
                    <></>
                  )}
                  {props.params.owner == id.toLowerCase() ? (
                    <TransferNFT />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </Stack>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={400} fontSize={'medium'}>
              Equity percentage: {props.params.royalty}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
