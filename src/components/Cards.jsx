/**
 * Cards Component - Individual Video Card Display
 * 
 * DSA CONCEPTS USED:
 * 1. Conditional Rendering - Boolean logic for UI states
 * 2. State Management - Component state with side effects
 * 3. Blockchain Interaction - Smart contract calls and validation
 * 4. Event Handling - User interaction processing
 * 5. Error Handling - Try-catch with user feedback
 * 6. Memory Management - Efficient state updates
 */

import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import '../App.css';

import { toast } from 'react-toastify'
import { parseEther } from '../contractConfig'
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai"
import { FaRegShareSquare } from "react-icons/fa";

function Cards({ item, currVideo, player, setPlayer, setCurrVideo, account, idx, processing, setProcessing, marketplace }) {

  // STATE MANAGEMENT - Component state with boolean flags
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) per state variable
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [canView, setCanView] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  // EFFECT HOOK - Dependency-based side effects
  // Time Complexity: O(1) for effect execution
  // Space Complexity: O(1) for effect cleanup
  useEffect(() => {
    checkViewAccess();
  }, [item, account]);

  // ACCESS VALIDATION - Boolean logic for user permissions
  // Time Complexity: O(1) for contract call
  // Space Complexity: O(1) for boolean result
  const checkViewAccess = async () => {
    try {
      const marketplacecontract = marketplace
      const hasAccess = await marketplacecontract.getview(item.id);
      setCanView(hasAccess);
    } catch (error) {
      console.log("Error checking access:", error);
      setCanView(false);
    }
  }

  // EVENT HANDLING - User interaction processing with state updates
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) for boolean state
  const handleLike = () => {
    if (disliked) {
      setDisliked(false); // Mutually exclusive state management
    }
    setLiked(!liked);
  }
  
  const handleDislike = () => {
    if (liked) {
      setLiked(false); // Mutually exclusive state management
    }
    setDisliked(!disliked);
  }

  // BLOCKCHAIN TRANSACTION - Payment processing algorithm
  // Time Complexity: O(1) for contract call, O(n) for transaction confirmation
  // Space Complexity: O(1) for transaction data
  async function handlePayment(item) {
    setProcessing(true)
    try {
      const marketplacecontract = marketplace
      console.log(marketplacecontract);   
      
      // DATA TRANSFORMATION - Price conversion for blockchain
      const price = parseEther(item.price);
      console.log("price to pay: " + price);
      
      // SMART CONTRACT INTERACTION - Payable function call
      const tx = await marketplacecontract.viewitem(item.id, {
        value: price
      });
      
      toast.info("Your transaction is being processed", {
        position: "top-center"
      })

      // TRANSACTION CONFIRMATION - Wait for blockchain confirmation
      await tx.wait();
      toast.success("Payment successful! You can now view the video.", { position: "top-center" })
      
      // STATE UPDATE - Refresh access validation
      await checkViewAccess();
      
      setPlayer(true);
      setCurrVideo(item)

    } catch (error) {
      // ERROR HANDLING - Try-catch with user feedback
      console.log(error);
      toast.error("Payment failed. Please try again.", {
        position: "top-center"
      });
    }
    setProcessing(false)
  }

  // EVENT HANDLING - Video player state management
  // Time Complexity: O(1) for state updates
  // Space Complexity: O(1) for state references
  const handlePlayVideo = () => {
    setPlayer(true);
    setCurrVideo(item);
  }

  // CONDITIONAL LOGIC - Thumbnail existence validation
  // Time Complexity: O(1) for string comparison
  // Space Complexity: O(1) for boolean result
  const hasThumbnail = item.thumbnailHash && item.thumbnailHash !== "";

  return (
    <div className='card-div'>
      <div className='card-inner p-2'>
        {/* CONDITIONAL RENDERING - Thumbnail vs video preview */}
        {hasThumbnail ? (
          <img 
            src={item.thumbnailUrl} 
            alt="Video thumbnail" 
            className='object-cover w-[230px] h-[230px] rounded overflow-hidden' 
          />
        ) : (
          // FALLBACK RENDERING - Video preview with play button overlay
          <div className='w-[230px] h-[230px] rounded overflow-hidden bg-gray-700 flex items-center justify-center'>
            <video
              className="w-full h-full object-cover"
              src={item.videoUrl}
              muted
              onLoadedData={(e) => {
                // VIDEO PROCESSING - Set to first frame for thumbnail
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-white text-2xl font-thin mt-3'>{item.title}</h3>
          <h4 className='text-white text-lg font-thin mt-1'>Price: <span className='text-blue-400'><strong>{item.price} </strong></span> ETH</h4>
          <h5 className='text-white text-sm font-thin mt-1'>Duration: {Math.floor(item.displayTime / 60)} minutes</h5>
          <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
            {/* CONDITIONAL RENDERING - Payment vs play button based on access */}
            {!player && (
              canView ? (
                <button 
                  type="button" 
                  className="text-white bg-gradient-to-r from-green-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2" 
                  onClick={handlePlayVideo}
                >
                  Watch Video
                </button>
              ) : (
                <button 
                  type="button" 
                  className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2" 
                  disabled={processing} 
                  onClick={() => { handlePayment(item) }}
                >
                  {processing ? "Processing..." : `Pay ${item.price} ETH`}
                </button>
              )
            )}
          </div>
          <div className='flex justify-center items-center gap-4 mt-2'>
            {/* INTERACTIVE ELEMENTS - Like/Dislike/Share buttons */}
            <button
              type="button"
              className={`flex items-center gap-2 text-white ${liked ? "bg-green-500" : " border border-green-500"} font-medium rounded text-sm px-4 py-1.5 text-center`}
              onClick={() => handleLike(item)}
            >
              <AiOutlineLike />
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 text-white ${disliked ? "bg-red-500" : "border border-red-500"} font-medium rounded text-sm px-4 py-1.5 text-center`}
              onClick={() => handleDislike(item)}
            >
              <AiOutlineDislike />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-4 py-1.5 text-center"
              onClick={() => {
                // CLIPBOARD OPERATION - Copy to clipboard functionality
                navigator.clipboard.writeText("https://ripples-of-music.netlify.app/")
                  .then(() => {
                    toast.success("Link copied to clipboard!", {
                      position: "top-center"
                    });
                  })
                  .catch(err => {
                    console.error("Failed to copy: ", err);
                  });
              }}
            >
              <FaRegShareSquare /> Share
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cards