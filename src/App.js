import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Heading,
  Center,
  Alert,
  AlertIcon,
  Button
} from '@chakra-ui/react';
import logo from './logo.svg';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={20}>
        <VStack spacing={10} align='stretch'>
          <Center>
          <Alert status='info' justifyContent='center'>
            <AlertIcon />
            Factom will be hard forked into Accumulate. Please burn your WFCT to get ACME.
          </Alert>
          </Center>
          <Center>
            <img src={logo} className="logo" alt="Logo" />
          </Center>
          <Box>
            <Heading as='h1' isTruncated>WFCT Burn Portal</Heading>
            <Text fontSize='2xl' color='gray'>Connect your wallet to burn WFCT</Text>
          </Box>
          <Box>
            <Button size='lg' colorScheme='teal' isDisabled>Connect Wallet</Button>
          </Box>
        </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
