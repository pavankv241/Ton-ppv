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
    <div className='text-white'>
      {/* Hero Section */}
      <div className='flex justify-around items-center pt-32'>
        <div className='mb-16 mx-5'>
          <h1 className='font-semibold text-6xl'>View and Create<br></br><span className='font-thin text-sky-400'>Video NFTs </span>(Non Fungible Tokens)</h1>
          <p className='pt-8 text-xl font-thin'>Video NFTs are unique digital assets that represent ownership of a specific video file.<br/>They ensure authenticity and provenance by recording ownership on the TON blockchain.<br/> Each NFT has a unique identifier, ensuring its uniqueness and non-interchangeability.</p>
          <Link to="/all-nft" as={Link}>
            <button type="button" className="text-white mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Explore All</button>
          </Link>
        </div>
        <div className=''>
          <img src={Ar} alt="" className='h-[490px]' />
        </div>
      </div>

      {/* Uploaded Videos Section */}
      {videos.length > 0 && (
        <div className='mt-16 px-8'>
          <h2 className='text-3xl font-semibold mb-8 text-center'>Your Uploaded Videos</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
            {videos.map((video, index) => (
              <div key={index} className='bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors'>
                <div className='mb-4'>
                  <h3 className='text-xl font-semibold mb-2'>{video.title}</h3>
                  <p className='text-gray-300 text-sm mb-2'>Price: {video.price} TON</p>
                  <p className='text-gray-400 text-xs'>IPFS Hash: {video.ipfsHash}</p>
                  <p className='text-gray-400 text-xs'>Uploaded: {new Date(video.timestamp).toLocaleDateString()}</p>
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => playVideo(video)}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm'
                  >
                    Play Video
                  </button>
                  <a
                    href={getIpfsUrl(video.ipfsHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm'
                  >
                    View on IPFS
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-semibold'>{selectedVideo.title}</h3>
              <button
                onClick={closeVideo}
                className='text-gray-400 hover:text-white text-2xl'
              >
                ×
              </button>
            </div>
            <video
              controls
              className='w-full h-96 object-contain'
              src={getIpfsUrl(selectedVideo.ipfsHash)}
            >
              Your browser does not support the video tag.
            </video>
            <div className='mt-4 text-sm text-gray-300'>
              <p>Price: {selectedVideo.price} TON</p>
              <p>IPFS Hash: {selectedVideo.ipfsHash}</p>
              <p>Contract: {selectedVideo.contractAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home