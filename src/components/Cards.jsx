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

import React, { useState } from 'react'
import { ethers } from 'ethers'
import '../App.css';

import { toast } from 'react-toastify'
import { parseEther, formatEther } from '../contractConfig'
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai"
import { FaRegShareSquare } from "react-icons/fa";

function Cards({ item, setProcessing, processing, marketplace }) {
  const [hasPaid, setHasPaid] = useState(false);

  const videoUrl = `https://gateway.pinata.cloud/ipfs/${item.videoHash}`;
  const hasThumbnail = item.thumbnailHash && item.thumbnailHash !== "";

  async function handlePayment() {
    setProcessing(true);
    try {
      const price = parseEther(item.price);
      const tx = await marketplace.payToView(item.id, { value: price });
      await tx.wait();
      setHasPaid(true);
      toast.success("Payment successful! Enjoy your video.", { position: "top-center" });
    } catch (error) {
      toast.error("Payment failed. Please try again.", { position: "top-center" });
    }
    setProcessing(false);
  }

  return (
    <div className="card-div bg-[#181824] rounded-xl shadow-lg p-4 flex flex-col items-center w-[320px]">
      <div className="w-full flex flex-col items-center">
        {/* Video or Thumbnail */}
        <div className="w-[260px] h-[180px] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center mb-4 relative">
          {hasPaid ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-lg"
            />
          ) : hasThumbnail ? (
            <img
              src={item.thumbnailUrl}
              alt="Video thumbnail"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <video
              src={videoUrl}
              muted
              controls={false}
              autoPlay={false}
              className="w-full h-full object-cover rounded-lg"
              onLoadedData={e => { e.target.currentTime = 0; }}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </div>
        {/* Title & Price */}
        <h3 className="text-white text-xl font-semibold mt-2 mb-1 truncate w-full text-center">{item.title}</h3>
        <div className="text-gray-300 text-base mb-4">
          Price: <span className="text-blue-400 font-bold">{item.price} ETH</span>
        </div>
        {/* Pay Button */}
        {!hasPaid && (
          <button
            className="w-full py-2 mb-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={processing}
            onClick={handlePayment}
          >
            {processing ? "Processing..." : `Pay ${item.price} ETH`}
          </button>
        )}
      </div>
      {/* Like, Dislike, Share */}
      <div className="flex justify-center items-center gap-4 mt-2 w-full">
        <button
          type="button"
          className="flex items-center gap-2 text-white border border-green-500 font-medium rounded px-4 py-1.5 text-center hover:bg-green-500 hover:text-white transition"
        >
          <AiOutlineLike />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-white border border-red-500 font-medium rounded px-4 py-1.5 text-center hover:bg-red-500 hover:text-white transition"
        >
          <AiOutlineDislike />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-4 py-1.5 text-center transition"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
              .then(() => {
                toast.success("Link copied to clipboard!", { position: "top-center" });
              })
              .catch(() => {
                toast.error("Failed to copy link.", { position: "top-center" });
              });
          }}
        >
          <FaRegShareSquare /> Share
        </button>
      </div>
    </div>
  )
}

export default Cards