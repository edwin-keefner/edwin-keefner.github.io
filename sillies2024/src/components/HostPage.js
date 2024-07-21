import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const HostPage = () => {
  const [pages, setPages] = useState({});
  const [videos, setVideos] = useState([]);

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

  const loadVideos = async () => {
    try {
      const videosSnapshot = await getDocs(collection(firestore, 'videos'));
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handlePageChange = async (newPage) => {
    try {
      await setDoc(doc(firestore, 'control', 'state'), { page: newPage });
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await deleteDoc(doc(firestore, 'videos', videoId));
      loadVideos();
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
            <button onClick={() => handleDelete(video.id)}>Delete</button>
            <p>Assigned to Page: {video.pageIndex}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostPage;
