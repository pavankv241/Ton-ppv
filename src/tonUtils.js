// TON Contract Utilities
// Handles interactions with the deployed VideoPremium contract

// Contract configuration
const TON_CONTRACT_ADDRESS = "kQCsjLr8O8u9Ngj2Y3i9KO10uziuI9r3ngQsBBBWtsyrcJvr";
const TON_NETWORK = "testnet";

// TON Contract Interaction Functions
export const tonUtils = {
  // Get contract address
  getContractAddress: () => TON_CONTRACT_ADDRESS,

  // Get network
  getNetwork: () => TON_NETWORK,

  // Check if TON Keeper is available
  isTonKeeperAvailable: () => {
    return typeof window.ton !== 'undefined' && 
           (window.ton.isTonKeeper || 
            window.ton.isExtension || 
            window.ton.version);
  },

  // Connect to TON Keeper wallet
  connectWallet: async () => {
    try {
      if (typeof window.ton !== 'undefined' && 
          (window.ton.isTonKeeper || window.ton.isExtension || window.ton.version)) {
        const accounts = await window.ton.request({ method: 'ton_requestAccounts' });
        return accounts && accounts.length > 0 ? accounts[0] : null;
      }
      return null;
    } catch (error) {
      console.error("TON wallet connection error:", error);
      throw error;
    }
  },

  // Get current account if already connected
  getCurrentAccount: async () => {
    try {
      if (typeof window.ton !== 'undefined' && 
          (window.ton.isTonKeeper || window.ton.isExtension || window.ton.version)) {
        const accounts = await window.ton.request({ method: 'ton_accounts' });
        return accounts && accounts.length > 0 ? accounts[0] : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting current account:", error);
      return null;
    }
  },

  // Call the counter function on the smart contract
  callCounterFunction: async (ipfsHash, title, price) => {
    try {
      // This is a simulation of the contract call
      // In a real implementation, you would use TON Connect or similar
      console.log("Calling TON contract counter function...");
      console.log("IPFS Hash:", ipfsHash);
      console.log("Title:", title);
      console.log("Price:", price);
      console.log("Contract Address:", TON_CONTRACT_ADDRESS);

      // Check if TON Keeper is connected
      const currentAccount = await tonUtils.getCurrentAccount();
      if (!currentAccount) {
        throw new Error("TON Keeper not connected");
      }

      console.log("Connected account:", currentAccount);

      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Return success
      return {
        success: true,
        transactionHash: "simulated_tx_hash_" + Date.now(),
        contractAddress: TON_CONTRACT_ADDRESS,
        account: currentAccount
      };
    } catch (error) {
      console.error("TON contract call error:", error);
      throw error;
    }
  },

  // Get contract info
  getContractInfo: () => {
    return {
      address: TON_CONTRACT_ADDRESS,
      network: TON_NETWORK,
      type: "VideoPremium",
      functions: ["counter", "id"]
    };
  },

  // Validate IPFS hash
  validateIpfsHash: (hash) => {
    // Basic IPFS hash validation
    return hash && hash.length > 0 && (hash.startsWith('Qm') || hash.startsWith('bafy'));
  },

  // Format TON address for display
  formatAddress: (address) => {
    if (!address) return "";
    return address.slice(0, 5) + "..." + address.slice(-5);
  },

  // Install TON Keeper prompt
  promptInstallTonKeeper: () => {
    const installTON = window.confirm("TON Keeper extension not found. Would you like to install it?");
    if (installTON) {
      window.open('https://chrome.google.com/webstore/detail/ton-keeper/pebffkomdmohgfaoojfclcgcifbjdjod', '_blank');
    }
  }
};

export default tonUtils; 