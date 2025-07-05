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
    <>
      <div className='flex flex-wrap gradient-bg-welcome gap-10 justify-center pt-24 pb-5 px-16'>
        {/* CONDITIONAL RENDERING - Player state-based UI */}
        {player && (
          <div style={{
            width: '650px',
            height: 'auto',
            margin: '0 auto',
            display: 'block',
          }}>
            <div className='audio-outer'>
              <div className='audio-inner'>
                <PlayerCard item={currVideo} player={player} setPlayer={setPlayer} setCurrVideo={setCurrVideo} currVideo={currVideo} />
              </div>
            </div>
          </div>
        )}
        {/* ARRAY RENDERING - Iterative component rendering */}
        {
          (videos.length > 0 ?
            videos.map((video, idx) => (
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
            ))
            : (
              <main style={{ padding: "1rem 0" }}>
                <h2 className='text-white'>No videos available</h2>
              </main>
            ))}
      </div>
    </>
  )
}

export default NFTs