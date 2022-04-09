import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Heading,
  Button,
  Icon,
  Flex,
  Spacer,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
  Link,
  Input
} from '@chakra-ui/react';

import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { truncateAddress } from "./utils";

import logo from './logo.svg';

function App() {

  const {
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();

  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  )

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setBalance(0);
    setError("");
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={10}>
        <VStack spacing={12} align='stretch'>
          <Box>
          <Flex>
            <Box>
              <img src={logo} className="logo" alt="Logo" />
            </Box>
            <Spacer />
            <Box align='right'>
              {!active ? (
                <Button size='lg' colorScheme='gray' onClick={() => {
                  activate(connectors.injected);
                  setProvider("injected");
                }}>Connect Wallet</Button>
              ) :
                <div>
                <Button size='lg' colorScheme='gray' variant='outline' mb={3}>{balance} WFCT</Button>
                <Menu>
                  <MenuButton as={Button} size='lg' colorScheme='gray' mb={3} ml={3} leftIcon={<CircleIcon color='#48BB78' />}>{account ? truncateAddress(account) : "Connected"}</MenuButton>
                  <MenuList className="address-menu">
                    <MenuItem onClick={() => {navigator.clipboard.writeText(account)}}><CopyIcon />Copy address</MenuItem>
                    <MenuItem><Link href={'https://etherscan.io/address/' + account} isExternal><ExternalLinkIcon />View on explorer</Link></MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
                  </MenuList>
                </Menu>
                </div>
              }
            </Box>
          </Flex>
          </Box>
          {!account ? (
            <Box px={15}>
              <Heading as='h1' isTruncated>Convert WFCT to ACME</Heading>
              <Text fontSize='2xl' my={4} color='gray'>Connect your wallet to continue</Text>
            </Box>
          ) : 
            <VStack spacing={5} align='stretch'>
              <Box px={15}>
                <Heading as='h1' isTruncated>🔥 Burn WFCT</Heading>
              </Box>
              <Box px={15}>
                <Text fontSize='2xl' my={4} color='gray'>How much WFCT do you want to convert?</Text>
                <Input variant='filled' placeholder='Amount of tokens' size='lg' width={300} mr={4} />WFCT
                <p>
                  <Link color='#3182ce'><Text my={2} fontSize='sm'>Available balance: {balance} WFCT</Text></Link>
                </p>
              </Box>
              <Box px={15}>
                <Text fontSize='2xl' my={4} color='gray'>Where to send ACME?</Text>
                <Input variant='filled' placeholder='Accumulate ACME token account' size='lg' width={400} />
                <p>
                  <Link color='#3182ce' isExternal href="https://docs.accumulatenetwork.io"><Text my={2} fontSize='sm'>How to generate ACME token account<ExternalLinkIcon ml={1} mb={1} /></Text></Link>
                </p>
              </Box>
              <Box p={15}>
                <Button size='lg' colorScheme='teal' mb={3} disabled>Convert</Button>
              </Box>
            </VStack>
          }
          {error && error.message ? (
            <Box>
              <Text color='red'>{error.message}</Text>
            </Box>
          ) :
            null
          }
        </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
