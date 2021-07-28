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
  FormHelperText,
  ModalFooter,
  Text,
  Box,
  Field,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Form,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import MainMintingContract from '../contracts/MainMintingContract.json';

function MintToken(params) {
  const web3React = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function CreateToken(values) {
    const contract = new Contract(
      MainMintingContract.networks[web3React.chainId].address,
      MainMintingContract.abi,
      web3React.library.getSigner()
    );
    console.log(values);
    if (typeof contract !== undefined)
      await contract
        .mintSuperSocialToken(values.tokenName, values.symbol, values.amount)
        .then(response => {
          console.log(response);
          onClose();
          // setVisible(false);
          // setConfirmLoading(false);
          // openNotification();
        })
        .catch(error => {
          // setVisible(false);
          // setConfirmLoading(false);
          console.log(error.message);
          // openFailNotification();
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
      await CreateToken(values);
      resolve();
      // setTimeout(() => {
      //   alert(JSON.stringify(values, null, 2));
      //   resolve();
      // }, 3000);
    });
  }

  return (
    <>
      <Button onClick={onOpen}>Mint Token</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        // size="6xl"

        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <FormControl id="tokenName">
                  <FormLabel htmlFor="tokenName">Name of Token</FormLabel>
                  <Input id="tokenName" {...register('tokenName')} />
                </FormControl>
                <FormControl id="symbol">
                  <FormLabel>Symbol</FormLabel>
                  <Input id="symbol" {...register('symbol')} />
                </FormControl>
                <FormControl id="amount">
                  <FormLabel>Amount to Mint</FormLabel>
                  <NumberInput>
                    <NumberInputField id="amount" {...register('amount')} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
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

export default MintToken;

//TODO:
// Check on load if social token has been minted
// If minted than show the stats
// if not minted than show the option of minting
