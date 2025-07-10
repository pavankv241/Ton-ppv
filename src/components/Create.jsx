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
import axios from 'axios'
import { toast } from 'react-toastify'
import { PINATA_CONFIG, DEFAULTS, isPinataConfigured, getPinataHeaders } from '../config'
import { createVideoUploadTransaction, getContractInfo } from '../utils/ton-transactions'
import { useTonConnectUI } from '@tonconnect/ui-react'

function Create({ marketplace, account, setMarketplace }) {
  const [videoFile, setVideoFile] = useState();
  const [isMinting, setIsMinting] = useState(false);
  const [forminfo, setFormInfo] = useState({
    title: "",
    price: DEFAULTS.MIN_PRICE
  });
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    document.title = "Mint NFT"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if(name === "price") {
      if (value <= 0) return
    }
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const videoChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please select a valid video file.', { position: "top-center" });
    }
  };

  const handleEvent = async (e) => {
    setIsMinting(true)
    e.preventDefault();
    if (!videoFile) {
      toast.error("Please select a video file", { position: "top-center" });
      setIsMinting(false);
      return;
    }
    if (!account) {
      toast.error("Please connect your TON wallet first", { position: "top-center" });
      setIsMinting(false);
      return;
    }
    if (!isPinataConfigured()) {
      toast.error("Pinata credentials not configured. Please set REACT_APP_PINATA_JWT environment variable or update config.js", { position: "top-center" });
      setIsMinting(false);
      return;
    }
    toast.info("Uploading video file to IPFS", { position: "top-center" })
    try {
      const videoData = new FormData();
      videoData.append('file', videoFile);
      const resVideo = await axios({
        method: "post",
        url: PINATA_CONFIG.API_URL,
        data: videoData,
        headers: getPinataHeaders(),
      });
      const ipfsHash = resVideo.data.IpfsHash;
      toast.success("Video uploaded to IPFS!", { position: "top-center" })
      const tonSuccess = await callTonContract(ipfsHash);
      if (tonSuccess) {
        const videoInfo = {
          ipfsHash: ipfsHash,
          title: forminfo.title,
          price: forminfo.price,
          timestamp: Date.now(),
          contractAddress: getContractInfo().address,
          network: getContractInfo().network
        };
        const existingVideos = JSON.parse(localStorage.getItem('tonVideos') || '[]');
        existingVideos.push(videoInfo);
        localStorage.setItem('tonVideos', JSON.stringify(existingVideos));
        toast.success("Video successfully uploaded and registered on TON blockchain!", { position: "top-center" });
        setTimeout(() => { window.location.reload(); }, 2000);
      }
    } catch (error) {
      toast.error("Error uploading video: " + error.message, { position: "top-center" })
    }
    setIsMinting(false)
  }

  // Helper for TON contract call (kept from original)
  async function callTonContract(ipfsHash) {
    try {
      if (!account) {
        throw new Error("Please connect your TON wallet first");
      }

      toast.info("Creating TON blockchain transaction...", {
        position: "top-center",
      });

      // Create transaction using TonConnect
      const transaction = createVideoUploadTransaction(
        ipfsHash, 
        forminfo.title, 
        forminfo.price, 
        account
      );

      console.log("Sending transaction:", transaction);

      // Send transaction via TonConnect
      const result = await tonConnectUI.sendTransaction(transaction);
      
      console.log("Transaction result:", result);

      toast.success("Video uploaded to TON blockchain!", {
        position: "top-center",
      });

      return true;
    } catch (error) {
      console.error("TON contract error:", error);
      toast.error("Failed to update TON blockchain: " + error.message, {
        position: "top-center",
      });
      return false;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#3a3a7c] py-16 px-4">
      <div className="w-full max-w-lg bg-[#23234b] rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center">Upload Video</h2>
        <form className="w-full" onSubmit={handleEvent}>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-white" htmlFor="videofile">Upload Video File</label>
            <input onChange={videoChangeHandler} name="videofile" className="block w-full text-base text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400" type="file" accept="video/*" />
          </div>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-lg font-medium text-white">Video Title</label>
            <input onChange={handleChange} type="text" id="title" name='title' className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-purple-400 focus:border-purple-400 block w-full p-3" placeholder="Enter video title" required />
          </div>
          <div className="mb-8">
            <label htmlFor="price" className="block mb-2 text-lg font-medium text-white">Price (TON)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={forminfo.price}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-purple-400 focus:border-purple-400 block w-full p-3"
              placeholder="Enter price in TON"
              min={DEFAULTS.MIN_PRICE}
              step="0.01"
              required
            />
          </div>
          <button
            disabled={isMinting || !account}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isMinting ? "Uploading..." : "Upload Video"}
          </button>
        </form>
        <div className="mt-8 text-sm text-gray-300 w-full text-center">
          <p>Contract Address: {getContractInfo().address}</p>
          <p>Network: {getContractInfo().network}</p>
          <p>Wallet Status: {account ? "Connected" : "Not Connected"}</p>
        </div>
      </div>
    </div>
  )
}

export default Create