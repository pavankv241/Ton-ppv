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

      // Check if itemCount function exists
      if (!contract.itemCount) {
        console.error("itemCount function not found in contract!");
        console.log("Available functions:", Object.keys(contract.functions));
        setLoading(false);
        return;
      }

      // Get the total number of items
      console.log("Calling itemCount()...");
      const itemCount = await contract.itemCount();
      console.log("Total items:", itemCount.toString());

      if (itemCount.toString() === "0") {
        console.log("No items found in contract");
        setVideos([]);
        setLoading(false);
        return;
      }

      // BLOCKCHAIN DATA RETRIEVAL - Smart contract interaction
      // Time Complexity: O(n) where n is number of items
      // Space Complexity: O(n) for returned data
      console.log("Fetching items...");
      let displayVideos = [];
      
      for (let i = 1; i <= itemCount; i++) {
        try {
          const item = await contract.items(i);
          console.log(`Item ${i}:`, item);
          
          // MEMORY MANAGEMENT - Efficient object creation
          const video = {
            id: i,
            uploader: item.seller,
            videoHash: item.tokenURI, // Using tokenURI as video hash
            thumbnailHash: "", // No thumbnail in this contract
            price: formatEther(item.price),
            displayTime: "3600", // Default display time
            videoUrl: `${PINATA_CONFIG.GATEWAY_URL}${item.tokenURI}`,
            thumbnailUrl: "",
            title: `Video ${i}` // You might want to store titles in metadata
          };
          console.log(`Processed video ${i}:`, video);
          displayVideos.push(video);
        } catch (itemError) {
          console.log(`Error fetching item ${i}:`, itemError);
        }
      }

      console.log("Final display videos:", displayVideos);
      setVideos(displayVideos);
      setLoading(false);
    } catch (error) {
      // ERROR HANDLING - Try-catch with fallback states
      console.error("Error loading videos:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
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