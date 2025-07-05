const hre = require("hardhat");

async function main() {
  console.log("Deploying PayPerView contract to Zora Sepolia Testnet...");

  // Get the contract factory
  const PayPerView = await hre.ethers.getContractFactory("PayPerView");
  
  // Deploy the contract
  const contract = await PayPerView.deploy();
  
  // Wait for deployment to finish
  await contract.deployed();

  console.log("PayPerView contract deployed to:", contract.address);
  console.log("Network:", hre.network.name);
  
  // Verify the deployment
  console.log("Deployment successful!");
  console.log("Contract address:", contract.address);
  
  // Save the contract address to a file for easy access
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contract.address,
    network: hre.network.name,
    deployer: await contract.signer.getAddress(),
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 