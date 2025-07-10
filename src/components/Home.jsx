import React, { useState, useEffect } from 'react'
import Ar from "../assets/Ar.svg"
import { Link } from 'react-router-dom'

function Home() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Load videos from localStorage
    const tonVideos = JSON.parse(localStorage.getItem('tonVideos') || '[]');
    setVideos(tonVideos);
  }, []);

  const playVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const getIpfsUrl = (ipfsHash) => {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#3a3a7c] text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center px-8 md:px-24 pt-32 pb-16">
        <div className="mb-12 md:mb-0 md:w-1/2">
          <h1 className="font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            Discover, Collect & Mint <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Video NFTs</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-gray-200 max-w-xl">
            Experience the next generation of digital ownership. Explore unique video NFTs, prove authenticity, and mint your own on the TON blockchain.
          </p>
          <Link to="/all-nft">
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition-all duration-200">
              Explore All NFTs
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={Ar} alt="NFT Hero" className="h-[340px] md:h-[480px] drop-shadow-2xl rounded-3xl" />
        </div>
      </section>

      {/* NFT Gallery Section */}
      <section className="flex-1 px-4 md:px-16 py-8 bg-transparent">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Your Uploaded Video NFTs</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {videos.map((video, index) => (
              <div key={index} className="bg-[#23234b] rounded-2xl shadow-xl p-5 flex flex-col items-center hover:scale-105 transition-transform duration-200">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-900 flex items-center justify-center">
                  <video
                    src={getIpfsUrl(video.ipfsHash)}
                    className="w-full h-full object-cover rounded-xl"
                    controls={false}
                    muted
                    onClick={() => playVideo(video)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1 truncate w-full text-center">{video.title}</h3>
                <p className="text-pink-400 font-bold mb-2">{video.price} TON</p>
                <button
                  onClick={() => playVideo(video)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-base mt-2 hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
                >
                  Play Video
                </button>
                <a
                  href={getIpfsUrl(video.ipfsHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base text-center block"
                >
                  View on IPFS
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-300 text-lg py-16">No videos uploaded yet. Mint your first NFT!</div>
        )}
      </section>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#23234b] rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl relative">
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">{selectedVideo.title}</h3>
            <video
              controls
              className="w-full h-96 object-contain rounded-xl mb-4"
              src={getIpfsUrl(selectedVideo.ipfsHash)}
            >
              Your browser does not support the video tag.
            </video>
            <div className="flex flex-col md:flex-row justify-between text-gray-300 text-sm gap-2">
              <span>Price: <span className="text-pink-400 font-bold">{selectedVideo.price} TON</span></span>
              <span>IPFS Hash: {selectedVideo.ipfsHash}</span>
              <span>Contract: {selectedVideo.contractAddress}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home