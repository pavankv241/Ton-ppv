/**
 * Configuration Management System
 * 
 * DSA CONCEPTS USED:
 * 1. Configuration Management - Centralized data structure
 * 2. Helper Functions - Utility functions with specific purposes
 * 3. Environment Variables - External configuration handling
 * 4. Object-Oriented Design - Structured data organization
 * 5. Default Values - Fallback configuration system
 * 6. Validation Functions - Boolean logic for configuration checks
 */

// Configuration file for Premium TON application

// Pinata IPFS Configuration
// Time Complexity: O(1) for configuration access
// Space Complexity: O(1) for configuration storage
export const PINATA_CONFIG = {
  JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1M2RhMTZjMy1jYzJhLTRlOTAtYWM4MS01ZTE2MDNmMGI5NWEiLCJlbWFpbCI6InBhdmFua3VtYXJrdi4yM21jYUBjYW1icmlkZ2UuZWR1LmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJiODU1NGNhZTRlMjIwMTk0Y2ViIiwic2NvcGVkS2V5U2VjcmV0IjoiZmFmNTJjOGNiYWI1MDVjM2E0ZGQ2MDkxNWQ3YTVjMTdlNzA0OTliZmU2MGFjMjI3M2EwNTNhYjI4MTgwYTVjZCIsImV4cCI6MTc4MzIxNjE1Mn0.WPLdFmSq4Ve8-6HMpA6ZPDj9YC1nPyyGF8vWFTxCBrg',
  API_URL: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  GATEWAY_URL: "https://gateway.pinata.cloud/ipfs/"
};

// TON Testnet Configuration
export const TON_CONFIG = {
  CONTRACT_ADDRESS: '', // TODO: Update with deployed contract address from Telegram bot
  CHAIN_ID: '-3', // TON Testnet chain ID
  CHAIN_NAME: 'TON Testnet',
  RPC_URL: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  BLOCK_EXPLORER: 'https://testnet.tonscan.org',
  NATIVE_CURRENCY: {
    name: 'TON',
    symbol: 'TON',
    decimals: 9
  }
};

// Application Configuration
// Time Complexity: O(1) for configuration access
// Space Complexity: O(1) for configuration storage
export const APP_CONFIG = {
  NAME: "Premium TON",
  DESCRIPTION: "PayPerView Video Platform on TON Testnet",
  VERSION: "1.0.0"
};

// Default Values - Fallback configuration system
// Time Complexity: O(1) for default value access
// Space Complexity: O(1) for default value storage
export const DEFAULTS = {
  DISPLAY_TIME: 3600, // 1 hour in seconds
  MIN_PRICE: 0.001,   // Minimum price in TON
  MAX_FILE_SIZE: 100 * 1024 * 1024 // 100MB
};

// VALIDATION FUNCTION - Configuration check algorithm
// Time Complexity: O(1) for string comparison
// Space Complexity: O(1) for boolean result
export const isPinataConfigured = () => {
  return PINATA_CONFIG.JWT && PINATA_CONFIG.JWT !== "YOUR_PINATA_JWT_TOKEN_HERE";
};

// HELPER FUNCTION - Header generation for API calls
// Time Complexity: O(1) for object creation
// Space Complexity: O(1) for header object
export const getPinataHeaders = (contentType = "multipart/form-data") => {
  return {
    Authorization: `Bearer ${PINATA_CONFIG.JWT}`,
    "Content-Type": contentType,
  };
}; 