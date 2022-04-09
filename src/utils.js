import BigNumber from 'bignumber.js'

export const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};
  
export const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function web3BNToFloatString(
  bn,
  divideBy,
  decimals,
  roundingMode = BigNumber.ROUND_DOWN
) {
  const converted = new BigNumber(bn.toString())
  const divided = converted.div(divideBy)
  return divided.toFixed(decimals, roundingMode)
}