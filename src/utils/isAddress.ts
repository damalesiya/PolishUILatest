import { keccak256 } from 'js-sha3';

// Source: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go

/**
 * Checks if the given string is an address
 */
export const isAddress = (address: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  }
  if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  // Otherwise check each case
  return isChecksumAddress(address);
};

/**
 * Checks if the given string is a checksummed address
 */
const isChecksumAddress = (address: string): boolean => {
  // Check each case
  address = address.replace('0x', '');
  const addressHash = keccak256(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};
