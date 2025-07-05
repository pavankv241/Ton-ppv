import { ethers } from "ethers";
import { ZORA_CONFIG } from './config';
import { marketplace_abi } from './Abi.js';

// Export ethers functions for convenience
export const { parseEther, formatEther } = ethers.utils;

// Contract address on Zora Sepolia Testnet (newly deployed)
export const CONTRACT_ADDRESS = ZORA_CONFIG.CONTRACT_ADDRESS;

// Contract ABI - Using the correct ABI from Abi.js
export const CONTRACT_ABI = marketplace_abi;

// Zora Sepolia Testnet configuration
export const NETWORK_CONFIG = {
  chainId: ZORA_CONFIG.CHAIN_ID,
  chainName: ZORA_CONFIG.CHAIN_NAME,
  rpcUrls: [ZORA_CONFIG.RPC_URL],
  nativeCurrency: ZORA_CONFIG.NATIVE_CURRENCY,
  blockExplorerUrls: [ZORA_CONFIG.BLOCK_EXPLORER]
};

// Get contract instance
export const getContract = async (withSigner = false) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  if (withSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Connect wallet
export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    // Switch to Zora Sepolia Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainId }],
    });
    
    return accounts[0];
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIG],
      });
      return await connectWallet();
    }
    throw error;
  }
}; 