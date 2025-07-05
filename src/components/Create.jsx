/**
 * Create Component - Video Upload Interface
 * 
 * DSA CONCEPTS USED:
 * 1. Form State Management - Controlled components with validation
 * 2. File Processing - Binary file handling and validation
 * 3. Asynchronous Operations - Promise-based API calls
 * 4. Error Handling - Try-catch with user feedback
 * 5. Blockchain Transaction - Sequential operation pattern
 * 6. Form Validation - Input sanitization and validation
 */

import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"
import axios from 'axios'
import { toast } from 'react-toastify'
import { parseEther } from '../contractConfig'
import { PINATA_CONFIG, DEFAULTS, isPinataConfigured, getPinataHeaders } from '../config'

function Create({ marketplace, account, setMarketplace }) {

  // STATE MANAGEMENT - Controlled form components
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) per state variable
  const [videoFile, setVideoFile] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [forminfo, setFormInfo] = useState({
    title: "",
    price: DEFAULTS.MIN_PRICE
  });

  useEffect(() => {
    document.title = "Create Video"
  }, []);

  // FORM VALIDATION - Input sanitization and validation
  // Time Complexity: O(1) for validation checks
  // Space Complexity: O(1) for state updates
  const handleChange = (event) => {
    const { name, value } = event.target;
    if(name === "price") {
      if (value <= 0) return // Validation: Prevent negative prices
    }
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // FILE PROCESSING - Binary file validation and handling
  // Time Complexity: O(1) for file type checking
  // Space Complexity: O(1) for file reference storage
  const videoChangeHandler = (event) => {
    const file = event.target.files[0];
    try {
      console.log("Video file type:", file.type);
    } catch (error) {
      console.log(error);
    }
    // VALIDATION ALGORITHM - File type checking
    if (file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a video file.');
      return;
    }
  };

  // MAIN UPLOAD ALGORITHM - Sequential operation pattern
  // Time Complexity: O(n) where n is file size (upload time)
  // Space Complexity: O(1) for local variables
  const handleEvent = async (e) => {
    setIsMinting(true)
    e.preventDefault();

    // VALIDATION - Pre-upload checks
    if (!videoFile) {
      toast.error("Please select a video file", {
        position: "top-center",
      });
      setIsMinting(false);
      return;
    }

    // CONFIGURATION VALIDATION - Check external dependencies
    if (!isPinataConfigured()) {
      toast.error("Pinata credentials not configured. Please set REACT_APP_PINATA_JWT environment variable or update config.js", {
        position: "top-center",
      });
      setIsMinting(false);
      return;
    }

    toast.info("Uploading video file", {
      position: "top-center",
    })
    console.log("uploading video file");

    try {
      // FILE UPLOAD ALGORITHM - Binary data processing
      // Time Complexity: O(n) where n is file size
      // Space Complexity: O(n) for FormData storage
      const videoData = new FormData();
      videoData.append('file', videoFile);

      // ASYNCHRONOUS API CALL - Promise-based upload
      const resVideo = await axios({
        method: "post",
        url: PINATA_CONFIG.API_URL,
        data: videoData,
        headers: getPinataHeaders(),
      });

      toast.success("Video uploaded!", {
        position: "top-center",
      })

      // BLOCKCHAIN TRANSACTION - Sequential operation pattern
      const videoHash = resVideo.data.IpfsHash;
      const thumbnailHash = ""; // Empty thumbnail hash
      const price = parseEther(forminfo.price.toString());
      const displayTime = DEFAULTS.DISPLAY_TIME; // Use default display time

      console.log("Uploading to blockchain with data:");
      console.log("Video hash:", videoHash);
      console.log("Thumbnail hash:", thumbnailHash);
      console.log("Price:", price.toString());
      console.log("Display time:", displayTime);
      console.log("Contract address:", marketplace.address);

      toast.info("Uploading video to blockchain", {
        position: "top-center",
      })

      // SMART CONTRACT INTERACTION - Transaction pattern
      // Time Complexity: O(1) for contract call
      // Space Complexity: O(1) for transaction data
      const tx = await marketplace.mint(
        videoHash,  // _tokenURI (using video hash as token URI)
        price       // _price
      );

      console.log("Transaction hash:", tx.hash);

      toast.info("Wait till transaction confirms....", {
        position: "top-center"
      })

      // TRANSACTION CONFIRMATION - Wait for blockchain confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt);
      toast.success("Video uploaded to blockchain successfully", { position: "top-center" })
      
      // Refresh the page to show the new video
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      // ERROR HANDLING - Try-catch with user feedback
      toast.error("Error uploading video")
      console.log(error);
    }
    setIsMinting(false)
  }

  return (
    <div className='h-screen pt-24'>
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">

          <form className="max-w-sm mx-auto">
            <div className='max-w-lg mx-auto'>
              <label className="block mb-2 text-sm font-medium text-white" htmlFor="videofile">Upload Video File</label>
              <input onChange={videoChangeHandler} name="videofile" className="block w-full mb-4 h-8 text-m text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" accept="video/*" />
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Video Title</label>
              <input onChange={handleChange} type="text" id="title" name='title' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter video title" required />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-white">Price (ETH)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={forminfo.price}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="0.001 ETH" />
            </div>
            
            <div className='text-center'>
              <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" disabled={isMinting}>
                {isMinting ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create