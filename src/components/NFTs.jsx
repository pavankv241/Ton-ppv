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

import React, { useEffect, useState } from 'react';
import { getAllVideosFromLocal, clearAllVideosFromLocal } from '../utils/videoStorage';
import { toNano } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';

function NFTs() {
  const [videos, setVideos] = useState([]);
  const [tonConnectUI] = useTonConnectUI();
  const [paying, setPaying] = useState(null); // ipfsHash of video being paid for
  const [playingVideo, setPlayingVideo] = useState(null); // video object being played

  useEffect(() => {
    setVideos(getAllVideosFromLocal());
  }, []);

  const handleClear = () => {
    clearAllVideosFromLocal();
    setVideos([]);
  };

  async function handlePay(video) {
    setPaying(video.ipfsHash);
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [{
        address: '0QClyiq7oFeFwq9rSOJY5J0yYtARbi8y_y5ksdbX0ZbOZWnR', // user-provided TON address
        amount: toNano(video.price.toString()).toString(),
      }]
    };
    try {
      await tonConnectUI.sendTransaction(transaction);
      setPlayingVideo(video);
      setPaying(null);
    } catch (e) {
      alert('Payment failed or cancelled');
      setPaying(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#3a3a7c] text-white flex flex-col">
      <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 md:px-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-8 text-center drop-shadow-lg">
          Explore All Video NFTs
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl text-center mb-8">
          Discover, collect, and unlock premium video content. Pay to view, support creators, and own unique digital assets.
        </p>
        <button
          onClick={handleClear}
          className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-lg shadow-lg transition-all duration-200"
        >
          Clear All Videos
        </button>
      </section>
      <section className="flex-1 px-2 md:px-16 py-8 bg-transparent">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col items-center w-[320px] border border-white/20 transition-transform hover:scale-105 hover:shadow-3xl">
                <div className="w-full flex flex-col items-center">
                  <div className="w-[260px] h-[180px] rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center mb-4 relative border border-white/10">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt="Video thumbnail"
                        className="object-cover w-full h-full rounded-2xl"
                      />
                    ) : (
                      <video
                        src={`https://gateway.pinata.cloud/ipfs/${video.ipfsHash}`}
                        muted
                        controls={false}
                        className="w-full h-full object-cover rounded-2xl opacity-60"
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                  </div>
                  <h3 className="text-white text-xl font-bold mt-2 mb-1 truncate w-full text-center drop-shadow-sm">{video.title}</h3>
                  <div className="text-pink-400 text-lg font-semibold mb-4 text-center">
                    {video.price} TON
                  </div>
                  <button
                    onClick={() => handlePay(video)}
                    disabled={paying === video.ipfsHash}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {paying === video.ipfsHash ? 'Processing...' : `Pay ${video.price} TON to Play Video`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2 className='text-white text-center text-2xl pt-24'>No videos available</h2>
          </main>
        )}
      </section>
      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#23234b] rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl relative">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">{playingVideo.title}</h3>
            <video
              controls
              className="w-full h-96 object-contain rounded-xl mb-4"
              src={`https://gateway.pinata.cloud/ipfs/${playingVideo.ipfsHash}`}
            >
              Your browser does not support the video tag.
            </video>
            <div className="flex flex-col md:flex-row justify-between text-gray-300 text-sm gap-2">
              <span>Price: <span className="text-pink-400 font-bold">{playingVideo.price} TON</span></span>
              <span>IPFS Hash: {playingVideo.ipfsHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTs;