import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const HostPage = () => {
  const [pages, setPages] = useState({});
  const [videos, setVideos] = useState([]);

  // Load pages from Firestore
  const loadPages = async () => {
    try {
      const pagesSnapshot = await getDocs(collection(firestore, 'pages'));
      const pagesData = {};
      pagesSnapshot.forEach((doc) => {
        pagesData[doc.id] = doc.data();
      });
      setPages(pagesData);
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  // Load videos from Firestore
  const loadVideos = async () => {
    try {
      const videosSnapshot = await getDocs(collection(firestore, 'videos'));
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  // Change the current page in Firestore
  const handlePageChange = async (newPage) => {
    try {
      await setDoc(doc(firestore, 'control', 'state'), { page: newPage });
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  // Update video page index in Firestore
  const handleVideoPageChange = async (videoId, newPageIndex) => {
    try {
      await setDoc(doc(firestore, 'videos', videoId), { pageIndex: newPageIndex }, { merge: true });
      loadVideos(); // Reload videos to reflect changes
    } catch (error) {
      console.error('Error updating video page index:', error);
    }
  };

  // Delete a video from Firestore
  const handleDelete = async (videoId) => {
    try {
      await deleteDoc(doc(firestore, 'videos', videoId));
      loadVideos(); // Reload videos to reflect deletion
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  useEffect(() => {
    loadPages();
    loadVideos();
  }, []);

  return (
    <div>
      <h2>Host Page</h2>
      <button onClick={() => handlePageChange('page1')}>Set Page 1</button>
      <button onClick={() => handlePageChange('page2')}>Set Page 2</button>
      {/* Add more buttons dynamically based on pages */}

      <h3>Manage Videos</h3>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-grid-item">
            <h4>{video.title}</h4>
            <video width="320" height="240" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div>
              <label>Page Index: </label>
              <input
                type="number"
                min="1"
                value={video.pageIndex || ''}
                onChange={(e) => handleVideoPageChange(video.id, e.target.value)}
              />
            </div>
            <button onClick={() => handleDelete(video.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostPage;
