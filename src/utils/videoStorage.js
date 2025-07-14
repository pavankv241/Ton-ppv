// Save a video object to localStorage
export function saveVideoToLocal(videoInfo) {
  const videos = JSON.parse(localStorage.getItem('tonVideos') || '[]');
  videos.push(videoInfo);
  localStorage.setItem('tonVideos', JSON.stringify(videos));
}

// Get all videos from localStorage
export function getAllVideosFromLocal() {
  return JSON.parse(localStorage.getItem('tonVideos') || '[]');
}

// Clear all videos from localStorage
export function clearAllVideosFromLocal() {
  localStorage.removeItem('tonVideos');
} 