import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Modal,
  useDisclosure,
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
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import SocialStreamableNFT from '../contracts/SocialStreamableNFT.json';

function MintNFT(params) {
  const web3React = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function CreateNFT(values) {
    const contract = new Contract(
      SocialStreamableNFT.networks[web3React.chainId].address,
      SocialStreamableNFT.abi,
      web3React.library.getSigner()
    );

    // console.log(values);
    if (typeof contract !== undefined)
      await contract
        .safeMint(values.address, values.URI)
        .then(response => {
          console.log(response);
          onClose();
        })
        .catch(error => {
          console.log(error.message);
          onClose();
        });
  }

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱";
    }
    return error;
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    console.log(values);
    return new Promise(async resolve => {
      await CreateNFT(values);
      resolve();
      // setTimeout(() => {
      //   alert(JSON.stringify(values, null, 2));
      //   resolve();
      // }, 3000);
    });
  }

  return (
    <>
      <Button onClick={onOpen}>Mint NFT!</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        // size="6xl"

        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Mint a NFT</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <FormControl id="address">
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input id="address" {...register('address')} />
                </FormControl>
                <FormControl id="URI">
                  <FormLabel>URI</FormLabel>
                  <Input id="URI" {...register('URI')} />
                </FormControl>
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

export default MintNFT;
