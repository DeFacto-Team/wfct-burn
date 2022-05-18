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
import LockerABI from './abi-locker.json'

import logo from './logo.svg';

function App() {

  const contract = [];
  contract[1] = '0x415acc3c6636211e67e248dc28400b452acefa68';
  contract[3] = '0x003c29cf67bc98a978cf97a2893b122f7a798239';
  contract[1337] = '0xa1B34A6B92FC585b0e0B63CdC82883Ff49290663';

  const contract2 = [];
  contract2[1] = '0xad204C28bd847077dC3132b43087AFf10bDe21b7';
  contract2[3] = '0x35C342B8E213D1F72135A1d06C500633a13076b1';
  contract2[1337] = '0xee2033862A583DbF2ca97D045e0802D06B8B2D45';

  const explorer = [];
  explorer[1] = "https://etherscan.io";
  explorer[3] = "https://ropsten.etherscan.io";
  explorer[1337] = "";

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
  const [value, setValue] = useState("");
  const [acmeValue, setACMEValue] = useState(0);
  const [acmeAddress, setACMEAddress] = useState("");
  const [symbol, setSymbol] = useState("");
  const [allowance, setAllowance] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [tokenContract, setTokenContract] = useState("");
  const [lockerContract, setLockerContract] = useState("");
  const [explorerURL, setExplorerURL] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    calculateACMEValue(event.target.value);
  };

  const handleChangeACME = (event) => {
    setACMEAddress(event.target.value);
  };

  const calculateACMEValue = (v) => {
    let val = Number(v) || 0;
    if (val > balance) {
      setAppError("Not enough tokens");
    } else {
      setAppError("");
    }
    const pow = new BigNumber('10').pow(new BigNumber(8));
    setACMEValue(web3BNToFloatString(val*5*1e8, pow, 0, BigNumber.ROUND_DOWN));
  }

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  );

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  const refreshState = () => {
    setAppError("");
    window.localStorage.setItem("provider", undefined);
  };

  const getBalance = (address) => {
    const contract = getContract(library, ERC20ABI, address);
    contract.methods.symbol().call().then(name_ => {
      setSymbol(name_);
    })
    contract.methods.balanceOf(account).call().then(balance_ => {
      const pow = new BigNumber('10').pow(new BigNumber(8));
      setBalance(web3BNToFloatString(balance_, pow, 8, BigNumber.ROUND_DOWN));
      setBalance2(web3BNToFloatString(balance_, pow, 2, BigNumber.ROUND_DOWN));
    })
  };

  const getAllowance = (address, spender) => {
    const contract = getContract(library, ERC20ABI, address);
    contract.methods.allowance(account, spender).call().then(amount_ => {
      setAllowance(amount_);
    })
  };

  const getContract = (library, abi, address) => {
    const web3 = new Web3(library.provider);
    return new web3.eth.Contract(abi, address)
  };

  const handleApprove = (address = tokenContract, spender = lockerContract) => {
    const contract = getContract(library, ERC20ABI, address);
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    setIsApproving(true);
    contract.methods.approve(spender, maxApproval).send({from: account}).then(_ => {
      window.location.reload(false);
    }).catch(error => {
      setIsApproving(false);
    });
  };

  const handleBurn = () => {
    const contract = getContract(library, LockerABI, lockerContract);
    const amountBig = new BigNumber(value, 10)*1e8;
    contract.methods.burn(amountBig, acmeAddress).send({from: account}).then(_ => {
      window.location.reload(false);
    })
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const connect = () => {
    activate(connectors.injected);
    setProvider("injected");
  }

  const compare = (allowance, value) => {
    let amount = getAmount(value);
    if (allowance > amount) {
      return true;
    }
    return false;
  }

  const getAmount = (value) => {
    let amount = 0;
    if (value !== "") {
      amount = parseFloat(value) || 0;
    }
    return amount;
  }

  useEffect(() => {
    setBalance(0);
    setBalance2("...");
    setSymbol("");
    if (account) {
      let cid = 1;
      if (chainId) {
        cid = chainId;
      }
      setTokenContract(contract[cid]);
      setLockerContract(contract2[cid]);
      setExplorerURL(explorer[cid]);
      getBalance(contract[cid]);
      getAllowance(contract[cid], contract2[cid]);
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
              <Link href="/">
                <img src={logo} className="logo" alt="Logo" />
              </Link>
            </Box>
            <Spacer />
            <Box align='right' className="menu">
              {!active ? (
                <Button size='lg' colorScheme='gray' onClick={() => connect()} mb={3}>Connect Wallet</Button>
              ) :
                <div>
                  {chainId === 1337 ? (
                    <Tooltip label='You are connected to localhost' fontSize='md'>
                      <Button size='lg' colorScheme='orange' variant='outline' mb={3}>Localhost</Button>
                    </Tooltip>
                  ) :
                    null
                  }
                  {chainId === 3 ? (
                    <Tooltip label='You are connected to testnet' fontSize='md'>
                      <Button size='lg' colorScheme='orange' variant='outline' mb={3}>Ropsten Testnet</Button>
                    </Tooltip>
                  ) :
                    null
                  }
                    {explorerURL === "" ? (
                      <Button size='lg' colorScheme='gray' variant='outline' mb={3} ml={3}>{balance2} {symbol}</Button>
                    ) :
                      <Tooltip label='View in explorer' fontSize='md'>
                        <Link href={explorerURL + '/token/' + tokenContract + '?a=' + account} isExternal>
                          <Button size='lg' colorScheme='gray' variant='outline' mb={3} ml={chainId === 3 ? ( 3 ) : null}>{balance2} {symbol}<ExternalLinkIcon ml={2} /></Button>
                        </Link>
                      </Tooltip>
                    }
                  <Menu>
                    <MenuButton as={Button} size='lg' colorScheme='gray' mb={3} ml={3} leftIcon={<CircleIcon color='#48BB78' />}>{account ? truncateAddress(account) : "Connected"}</MenuButton>
                    <MenuList className="address-menu">
                      <MenuItem onClick={() => {navigator.clipboard.writeText(account)}}><CopyIcon />Copy address</MenuItem>
                      {explorerURL !== "" ? (
                        <MenuItem><Link href={explorerURL + '/address/' + account} isExternal><ExternalLinkIcon />View on explorer</Link></MenuItem>
                      ) : null
                      }
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
                <Alert status='warning' justifyContent='center'>
                  <AlertIcon />
                  <AlertDescription>Use Google Chrome and MetaMask for the best experience.</AlertDescription>
                </Alert>
              </Box>
              <Box px={15}>
                <Text fontSize='2xl' my={4} color='gray'>How much WFCT do you want to convert?</Text>
                <Input onChange={handleChange} value={value} variant='filled' placeholder='Amount of tokens' size='lg' style={{ maxWidth: '400px', width: '100%' }} />
                <p>
                  <Link color='#3182ce' onClick={() => { setValue(balance); calculateACMEValue(balance); }}><Text my={2} fontSize='sm'>Available balance: {balance} WFCT</Text></Link>
                </p>
              </Box>
              {!appError ? (
                <div>
                <Box px={15}>
                  <Alert status='info' justifyContent='center' style={{ maxWidth: '400px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <AlertIcon />
                    You will receive <Text ml={1}><strong>{acmeValue} ACME</strong></Text>
                  </Alert>
                </Box>
                <Box px={15}>
                  <Text fontSize='2xl' my={4} color='gray'>Where to send ACME?</Text>
                  <Input onChange={handleChangeACME} value={acmeAddress} variant='filled' placeholder='Accumulate ACME token account' size='lg' style={{ maxWidth: '400px', width: '100%' }} />
                  <p>
                    <Link color='#3182ce' isExternal href="https://docs.accumulatenetwork.io"><Text my={2} fontSize='sm'>How to generate ACME token account<ExternalLinkIcon ml={1} mb={1} /></Text></Link>
                  </p>
                </Box>
                <Box p={15}>
                  <Button size='lg' colorScheme='teal' mb={3} ml={2} mr={2} onClick={() => handleApprove()} disabled={compare(allowance, value) || isApproving}>{isApproving ? "Approving..." : (!compare(allowance, value) ? "Approve WFCT" : "Approved")}</Button>
                  <Button size='lg' colorScheme='teal' mb={3} ml={2} mr={2} onClick={() => handleBurn()} disabled={!compare(allowance, value) || isApproving || getAmount(value) === 0 || acmeAddress === ""}>Burn WFCT</Button>
                </Box>
                </div>
              ) : 
                <Box px={15}>
                  <Alert status='error' justifyContent='center' style={{ maxWidth: '400px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <AlertIcon />
                    {appError}
                  </Alert>
                </Box>            
              }

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
        </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
