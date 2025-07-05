import React, { useState } from 'react'
import '../App.css';

function PlayerCard({ item, player, setPlayer, setCurrVideo, currVideo }) {

  function close() {
    setPlayer(false);
    setCurrVideo(null);
    console.log("close");
  }

  return (
    <>
      {player && item && <div>
        <div className='audio-div' style={{ height: "auto", width: "auto" }}>
          <div className='audio-inner p-2'>
            <div className='flex flex-col justify-center items-center'>
              {console.log("PlayerCard rendering with item:", item)}
              {console.log("Video URL in PlayerCard:", item.videoUrl)}
              <video 
                width="auto" 
                height="400" 
                controls 
                autoPlay
                onError={(e) => {
                  console.error("Video loading error:", e);
                  console.error("Video URL that failed:", item.videoUrl);
                }}
                onLoadStart={() => {
                  console.log("Video loading started for URL:", item.videoUrl);
                }}
                onCanPlay={() => {
                  console.log("Video can play for URL:", item.videoUrl);
                }}
              >
                <source src={item.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h3 className='text-white text-2xl font-thin mt-3'>{item.title}</h3>
              <h4 className='text-white text-lg font-thin mt-1'>Price: {item.price} ETH</h4>
              <h5 className='text-white text-sm font-thin mt-1'>Duration: {Math.floor(item.displayTime / 60)} minutes</h5>
              <p className='text-white text-sm font-thin mt-1'>Uploader: {item.uploader}</p>
              <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
                <button 
                  type="button" 
                  className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2" 
                  onClick={() => { close() }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

export default PlayerCard