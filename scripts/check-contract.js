const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x3557CC57bFeC1Ba4B7119e5589712A6e3B9A3DC7";
  
  console.log("Checking contract at address:", contractAddress);
  
  const contract = await ethers.getContractAt("PayPerView", contractAddress);
  
  console.log("Contract functions:", Object.keys(contract.functions));
  
  // Get videos
  try {
    const [uploaders, videoHashes, thumbnailHashes, prices, displayTimes] = await contract.getVideos();
    console.log("Number of videos:", uploaders.length);
    
    if (uploaders.length > 0) {
      console.log("First video uploader:", uploaders[0]);
      console.log("First video hash:", videoHashes[0]);
      console.log("First video price:", ethers.utils.formatEther(prices[0]));
      
      // Test canView for the first video
      const testAddress = "0x0000000000000000000000000000000000000000";
      const canViewResult = await contract.canView(0, testAddress);
      console.log("Can view test (address 0x0, video 0):", canViewResult);
      
      // Test canView for the uploader
      const canViewUploader = await contract.canView(0, uploaders[0]);
      console.log("Can view test (uploader, video 0):", canViewUploader);
    }
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 