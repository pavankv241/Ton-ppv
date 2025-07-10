import { beginCell, Address, toNano } from '@ton/core';

// TON Contract Address
const TON_CONTRACT_ADDRESS = "kQCsjLr8O8u9Ngj2Y3i9KO10uziuI9r3ngQsBBBWtsyrcJvr";

// Utility function to convert string to nano
export const toNanoAmount = (amount) => {
  return toNano(amount.toString()).toString();
};

// Create transaction for video upload (calling counter function)
export const createVideoUploadTransaction = (ipfsHash, title, price, senderAddress) => {
  try {
    // Create the transaction body for the counter function
    const body = beginCell()
      .storeUint(0x7362d09c, 32) // Add message op code
      .storeUint(1, 32) // amount parameter
      .endCell();

    return {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [{
        address: TON_CONTRACT_ADDRESS,
        amount: toNano('0.05').toString(), // estimated fee
        payload: body.toBoc().toString('base64'),
      }]
    };
  } catch (error) {
    console.error('Error creating video upload transaction:', error);
    throw error;
  }
};

// Create transaction for video purchase
export const createVideoPurchaseTransaction = (videoId, price, senderAddress) => {
  try {
    const body = beginCell()
      .storeUint(0x7362d09c, 32) // Purchase message op code
      .storeUint(videoId, 32) // video ID
      .endCell();

    return {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [{
        address: TON_CONTRACT_ADDRESS,
        amount: toNano(price.toString()).toString(),
        payload: body.toBoc().toString('base64'),
      }]
    };
  } catch (error) {
    console.error('Error creating video purchase transaction:', error);
    throw error;
  }
};

// Get contract info
export const getContractInfo = () => {
  return {
    address: TON_CONTRACT_ADDRESS,
    network: "testnet",
    type: "VideoPremium"
  };
};

// Validate TON address
export const isValidTonAddress = (address) => {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
};

// Format TON address for display
export const formatTonAddress = (address) => {
  if (!address) return "";
  return address.slice(0, 5) + "..." + address.slice(-5);
}; 