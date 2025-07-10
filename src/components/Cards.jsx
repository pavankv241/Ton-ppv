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

function Cards({ item, marketplace }) {
  const [hasPaid, setHasPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

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
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col items-center w-[320px] border border-white/20 transition-transform hover:scale-105 hover:shadow-3xl">
      <div className="w-full flex flex-col items-center">
        {/* Video or Thumbnail */}
        <div className="w-[260px] h-[180px] rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center mb-4 relative border border-white/10">
          {hasPaid ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : hasThumbnail ? (
            <img
              src={item.thumbnailUrl}
              alt="Video thumbnail"
              className="object-cover w-full h-full rounded-2xl"
            />
          ) : (
            <video
              src={videoUrl}
              muted
              controls={false}
              autoPlay={false}
              className="w-full h-full object-cover rounded-2xl opacity-60"
              onLoadedData={e => { e.target.currentTime = 0; }}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </div>
        {/* Title & Price */}
        <h3 className="text-white text-xl font-bold mt-2 mb-1 truncate w-full text-center drop-shadow-sm">{item.title}</h3>
        <div className="text-pink-400 text-lg font-semibold mb-4 text-center">
          {item.price} TON
        </div>
        {/* Pay Button */}
        {!hasPaid && (
          <button
            className="w-full py-2 mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-base shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={processing}
            onClick={handlePayment}
          >
            {processing ? "Processing..." : `Pay ${item.price} TON`}
          </button>
        )}
      </div>
      {/* Like, Dislike, Share */}
      <div className="flex justify-center items-center gap-4 mt-2 w-full">
        <button
          type="button"
          className="flex items-center gap-2 text-white border border-green-400 font-medium rounded-lg px-4 py-1.5 text-center hover:bg-green-400/80 hover:text-white transition shadow-sm"
        >
          <AiOutlineLike />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-white border border-red-400 font-medium rounded-lg px-4 py-1.5 text-center hover:bg-red-400/80 hover:text-white transition shadow-sm"
        >
          <AiOutlineDislike />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-500/80 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-1.5 text-center transition shadow-sm"
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