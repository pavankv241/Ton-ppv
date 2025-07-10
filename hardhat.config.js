require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    tonTestnet: {
      url: "https://testnet.toncenter.com/api/v2/jsonRPC",
      accounts: ["be9ee3b499bf3a95d1608953c001d4e2b7e5f9f51317ec059045b733c9f24e40"],
      chainId: -3,
    },
    // Keep zoraSepolia for reference
    zoraSepolia: {
      url: "https://sepolia.rpc.zora.energy",
      accounts: ["be9ee3b499bf3a95d1608953c001d4e2b7e5f9f51317ec059045b733c9f24e40"],
      chainId: 999999999,
    },
  },
}; 