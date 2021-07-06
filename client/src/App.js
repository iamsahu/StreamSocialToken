import React from 'react';
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  chakra,
  Flex,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

function App() {
  return (
    <Box>
      <chakra.header
        bg="red.300"
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        h="16"
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
              STREAMABLE SOCIAL TOKEN
            </chakra.h1>
          </Flex>
          <ColorModeSwitcher justifySelf="flex-end" />
        </Flex>
      </chakra.header>
      <Flex></Flex>
    </Box>
  );
}

export default App;
