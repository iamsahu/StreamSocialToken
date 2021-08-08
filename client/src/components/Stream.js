import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import sfcontext from '../helpers/sfcontext';
import React, { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import SocialStreamableNFT from '../contracts/SocialStreamableNFT.json';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

function Stream(params) {
  console.log(params);
  const web3React = useWeb3React();
  const sf = useContext(sfcontext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    console.log(values);
    return new Promise(async resolve => {
      await CreateFlow(values);
      resolve();
      // setTimeout(() => {
      //   alert(JSON.stringify(values, null, 2));
      //   resolve();
      // }, 3000);
    });
  }
  //Check if the current metamask account is the creator of the NFT if yes then go to the following:
  //Fire query to find out if stream is going on to the NFT
  //If stream is goin to the NFT provide stop & modify options
  //If stream is not going to the NFT provide start stream

  //If not the creator of the NFT then show stream data
  async function CreateFlow(values) {
    if (sf === null) return;
    console.log(params.socialToken);
    // console.log(web3React.chainId);
    console.log(SocialStreamableNFT.networks[web3React.chainId].address);
    console.log(values.flowRate);
    const we = new Web3();
    const bob = sf.user({
      address: web3React.account,
      token: params.socialToken,
    });

    // await bob
    //   .flow({
    //     recipient: SocialStreamableNFT.networks[web3React.chainId].address,
    //     flowRate: values.flowRate.toString(),
    //     userData: we.eth.abi.encodeParameter('uint256', params.id),
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
    //   .then(response => {
    //     console.log(response);

    //     // setVisible(false);
    //     // setConfirmLoading(false);
    //   });
    var BN = we.utils.BN;
    console.log(params.totalQuantity);
    const totalQuantity = new BN(params.totalQuantity);
    console.log(totalQuantity.toString());
    let iGet = totalQuantity.mul(new BN(params.royalty));
    iGet = iGet.div(new BN(100));
    console.log('My Share: ' + iGet.toString());
    let perMonth = iGet.div(new BN(60000000));
    console.log('Month: ' + perMonth.toString());
    let perSec = perMonth.div(new BN(3600 * 24 * 30));
    console.log('Per Sec: ' + perSec.toString());

    await sf.cfa
      .createFlow({
        superToken: params.socialToken.toString(),
        sender: web3React.account.toString(),
        receiver:
          SocialStreamableNFT.networks[web3React.chainId].address.toString(),
        flowRate: new BN(perSec.toString()),
        userData: we.eth.abi.encodeParameter('uint256', params.id),
      })
      .catch(error => {
        console.log(error);
      })
      .then(response => {
        console.log(response);
        onClose();
        // setVisible(false);
        // setConfirmLoading(false);
      });
  }
  return (
    <>
      <Button onClick={onOpen}>Stream</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        // size="6xl"

        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Start the stream</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                {/* <FormLabel>Start the stream!!</FormLabel> */}
                {/* <FormControl id="flowRate">
                  <FormLabel htmlFor="flowRate">flowRate</FormLabel>
                  <Input id="flowRate" {...register('flowRate')} />
                </FormControl> */}
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isSubmitting} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default Stream;
// This component will manage if stream is going to the NFT
// It will help manage the stream
