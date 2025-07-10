/**
 * NFTs Component - Video Listing and Display
 * 
 * DSA CONCEPTS USED:
 * 1. Data Fetching - Asynchronous data retrieval from blockchain
 * 2. Array Processing - Iterative data transformation
 * 3. State Management - Component state with loading states
 * 4. Error Handling - Try-catch with fallback states
 * 5. Memory Management - Efficient data structure creation
 * 6. Conditional Rendering - Boolean state-based UI rendering
 */

import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import PlayerCard from './PlayerCard';
import { ethers } from 'ethers';
import { getContract, formatEther } from '../contractConfig';
import { PINATA_CONFIG } from '../config';

// import { toast } from 'react-toastify';

function NFTs({ marketplace, setMarketplace, account }) {

  // STATE MANAGEMENT - Component state with loading states
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(n) where n is number of videos
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [processing, setProcessing] = useState(false)

  // DATA FETCHING ALGORITHM - Asynchronous blockchain data retrieval
  // Time Complexity: O(n) where n is number of videos in contract
  // Space Complexity: O(n) for storing video data
  const loadVideos = async () => {
    setLoading(true)
    try {
      let contract = marketplace;
      if (!contract) {
        console.log("No marketplace contract, getting new contract instance...");
        contract = await getContract(false);
      }

      console.log("Contract address:", contract.address);
      console.log("Contract ABI functions:", Object.keys(contract.functions));

      // Check if getVideos function exists
      if (!contract.getVideos) {
        console.error("getVideos function not found in contract!");
        console.log("Available functions:", Object.keys(contract.functions));
        
        // Try alternative functions
        if (contract.itemCount) {
          console.log("Found itemCount function, trying marketplace approach...");
          const itemCount = await contract.itemCount();
          console.log("Item count:", itemCount.toString());
          
          if (itemCount.toString() === "0") {
            console.log("No items found");
            setVideos([]);
            setLoading(false);
            return;
          }
          
          // Use marketplace approach
          let displayVideos = [];
          for (let i = 1; i <= itemCount; i++) {
            try {
              const item = await contract.items(i);
              console.log(`Item ${i}:`, item);
              
              const video = {
                id: i, // Keep as i since marketplace items start from 1
                uploader: item.seller,
                videoHash: item.tokenURI,
                thumbnailHash: "",
                price: formatEther(item.price),
                displayTime: "3600",
                videoUrl: `${PINATA_CONFIG.GATEWAY_URL}${item.tokenURI}`,
                thumbnailUrl: "",
                title: `Video ${i}`
              };
              displayVideos.push(video);
            } catch (itemError) {
              console.log(`Error fetching item ${i}:`, itemError);
            }
          }
          
          setVideos(displayVideos);
          setLoading(false);
          return;
        }
        
        setLoading(false);
        return;
      }

      // BLOCKCHAIN DATA RETRIEVAL - Smart contract interaction
      // Time Complexity: O(1) for contract call, O(n) for data processing
      // Space Complexity: O(n) for returned arrays
      console.log("Calling getVideos()...");
      const [uploaders, videoHashes, thumbnailHashes, prices, displayTimes] = await contract.getVideos();
      
      console.log("Raw data from contract:");
      console.log("Uploaders:", uploaders);
      console.log("Video hashes:", videoHashes);
      console.log("Thumbnail hashes:", thumbnailHashes);
      console.log("Prices:", prices);
      console.log("Display times:", displayTimes);
      console.log("Videos found:", uploaders.length);

      // ARRAY PROCESSING - Data transformation and mapping
      // Time Complexity: O(n) where n is number of videos
      // Space Complexity: O(n) for transformed data structure
      let displayVideos = [];
      for (let i = 0; i < uploaders.length; i++) {
        // MEMORY MANAGEMENT - Efficient object creation
        const video = {
          id: i, // Video IDs start from 0 in the contract
          uploader: uploaders[i],
          videoHash: videoHashes[i],
          thumbnailHash: thumbnailHashes[i],
          price: formatEther(prices[i]),
          displayTime: displayTimes[i].toString(),
          videoUrl: `${PINATA_CONFIG.GATEWAY_URL}${videoHashes[i]}`,
          thumbnailUrl: `${PINATA_CONFIG.GATEWAY_URL}${thumbnailHashes[i]}`,
          title: `Video ${i + 1}` // Display title starts from 1 for user-friendly display
        };
        console.log(`Processed video ${i} (display: ${i + 1}):`, video);
        console.log(`Video URL: ${video.videoUrl}`);
        console.log(`Thumbnail URL: ${video.thumbnailUrl}`);
        console.log(`Gateway URL: ${PINATA_CONFIG.GATEWAY_URL}`);
        displayVideos.push(video);
      }

      console.log("Final display videos:", displayVideos);
      
      // Test contract interaction
      if (displayVideos.length > 0) {
        console.log("Testing contract interaction...");
        try {
          const testVideo = displayVideos[0];
          console.log("Testing with video:", testVideo);
          
          // Test canView function
          const canViewResult = await contract.canView(testVideo.id, account || "0x0000000000000000000000000000000000000000");
          console.log(`Can view test video ${testVideo.id}: ${canViewResult}`);
          
          // Test getVideos function again
          const [testUploaders, testVideoHashes, testThumbnailHashes, testPrices, testDisplayTimes] = await contract.getVideos();
          console.log("Test getVideos result:", {
            uploaders: testUploaders,
            videoHashes: testVideoHashes,
            thumbnailHashes: testThumbnailHashes,
            prices: testPrices,
            displayTimes: testDisplayTimes
          });
        } catch (testError) {
          console.error("Contract test failed:", testError);
        }
      }
      
      setVideos(displayVideos);
      setLoading(false);
    } catch (error) {
      // ERROR HANDLING - Try-catch with fallback states
      console.error("Error loading videos:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data,
        transaction: error.transaction
      });
      setLoading(false);
    }
  }

  // EFFECT HOOK - Dependency-based side effects
  // Time Complexity: O(1) for effect execution
  // Space Complexity: O(1) for effect cleanup
  useEffect(() => {
    loadVideos()
  }, [marketplace])

  // STATE MANAGEMENT - Video player state
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) for current video reference
  let [currVideo, setCurrVideo] = useState(null);
  let [player, setPlayer] = useState(false);

  // CONDITIONAL RENDERING - Loading state handling
  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#3a3a7c] text-white flex flex-col">
      <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 md:px-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-8 text-center drop-shadow-lg">
          Explore All Video NFTs
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl text-center mb-8">
          Discover, collect, and unlock premium video content on the TON blockchain. Pay to view, support creators, and own unique digital assets.
        </p>
      </section>
      <section className="flex-1 px-2 md:px-16 py-8 bg-transparent">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {videos.map((video, idx) => (
              <Cards 
                key={idx}
                item={video} 
                currVideo={currVideo} 
                player={player} 
                setPlayer={setPlayer} 
                setCurrVideo={setCurrVideo} 
                account={account} 
                idx={idx} 
                processing={processing} 
                setProcessing={setProcessing} 
                marketplace={marketplace} 
              />
            ))}
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2 className='text-white text-center text-2xl pt-24'>No videos available</h2>
          </main>
        )}
      </section>
      {/* Player Modal */}
      {player && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#23234b] rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl relative">
            <PlayerCard item={currVideo} player={player} setPlayer={setPlayer} setCurrVideo={setCurrVideo} currVideo={currVideo} />
          </div>
        </div>
      )}
    </div>
  )
}

export default NFTs