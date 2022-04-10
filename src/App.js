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
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip
} from '@chakra-ui/react';

import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import Web3 from 'web3';
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { truncateAddress, web3BNToFloatString } from "./utils";
import BigNumber from 'bignumber.js'
   
import ERC20ABI from './abi-erc20.json'

import logo from './logo.svg';

function App() {

  const contract = [];
  contract[1] = '0x415acc3c6636211e67e248dc28400b452acefa68';
  contract[3] = '0x003c29cf67bc98a978cf97a2893b122f7a798239';

  const {
    account,
    activate,
    deactivate,
    library,
    active,
    chainId,
    error
  } = useWeb3React();

  const [appError, setAppError] = useState("");
  const [balance, setBalance] = useState(0);
  const [balance2, setBalance2] = useState("...");
  const [value, setValue] = React.useState("");

  const handleChange = (event) => setValue(event.target.value);

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
    setAppError("");
    window.localStorage.setItem("provider", undefined);
  };

  const getBalance = (address) => {
    const contract = getContract(library, ERC20ABI, address);
    contract.methods.balanceOf(account).call().then(balance_ => {
      const pow = new BigNumber('10').pow(new BigNumber(8))
      setBalance(web3BNToFloatString(balance_, pow, 8, BigNumber.ROUND_DOWN))
      setBalance2(web3BNToFloatString(balance_, pow, 2, BigNumber.ROUND_DOWN))
    })
  };

  const getContract = (library, abi, address) => {
    const web3 = new Web3(library.provider);
    return new web3.eth.Contract(abi, address)
  };
  
  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const connect = () => {
    activate(connectors.injected);
    setProvider("injected");
  }

  useEffect(() => {
    setBalance(0);
    setBalance2("...");
    if (account) {
      let cid = 1;
      if (chainId) {
        cid = chainId;
      }
      getBalance(contract[cid]);
    }
  }, [account, chainId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider]);
    }
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
            <Box align='right' className="menu">
              {!active ? (
                <Button size='lg' colorScheme='gray' onClick={() => connect()} mb={3}>Connect Wallet</Button>
              ) :
                <div>
                  {chainId === 3 ? (
                    <Tooltip label='You are connected to testnet' fontSize='md'>
                      <Button size='lg' colorScheme='orange' variant='outline' mb={3}>Ropsten Testnet</Button>
                    </Tooltip>
                  ) :
                    null
                  }
                  <Tooltip label='View in explorer' fontSize='md'>
                    <Link href={
                          chainId === 3 ? (
                            'https://ropsten.etherscan.io/token/' + contract[3] + '?a=' + account
                          ) :
                            'https://etherscan.io/token/' + contract[1] + '?a=' + account
                          } isExternal>
                      <Button size='lg' colorScheme='gray' variant='outline' mb={3} ml={chainId === 3 ? ( 3 ) : null}>{balance2} WFCT<ExternalLinkIcon ml={2} /></Button>
                    </Link>
                  </Tooltip>
                  <Menu>
                    <MenuButton as={Button} size='lg' colorScheme='gray' mb={3} ml={3} leftIcon={<CircleIcon color='#48BB78' />}>{account ? truncateAddress(account) : "Connected"}</MenuButton>
                    <MenuList className="address-menu">
                      <MenuItem onClick={() => {navigator.clipboard.writeText(account)}}><CopyIcon />Copy address</MenuItem>
                      <MenuItem><Link href={
                        chainId === 3 ? (
                          'https://ropsten.etherscan.io/address/' + account
                        ) :
                          'https://etherscan.io/address/' + account
                        } isExternal><ExternalLinkIcon />View on explorer</Link></MenuItem>
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
                <Input onChange={handleChange} value={value} variant='filled' placeholder='Amount of tokens' size='lg' style={{ maxWidth: '400px', width: '100%' }} />
                <p>
                  <Link color='#3182ce' onClick={() => setValue(balance)}><Text my={2} fontSize='sm'>Available balance: {balance} WFCT</Text></Link>
                </p>
              </Box>
              <Box px={15}>
                <Text fontSize='2xl' my={4} color='gray'>Where to send ACME?</Text>
                <Input variant='filled' placeholder='Accumulate ACME token account' size='lg' style={{ maxWidth: '400px', width: '100%' }} />
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
            <Alert status='error' justifyContent='center'>
              <AlertIcon />
              <AlertTitle mr={2}>MetaMask Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) :
            null
          }
          {appError ? (
            <Alert status='error' justifyContent='center'>
              <AlertIcon />
              <AlertTitle mr={2}>Application Error</AlertTitle>
              <AlertDescription>{appError}</AlertDescription>
            </Alert>
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
