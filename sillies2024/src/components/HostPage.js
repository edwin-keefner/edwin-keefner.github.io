import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
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

  const handleVideoPageChange = async (videoId, newPageIndex) => {
    try {
      await setDoc(doc(firestore, 'videos', videoId), { pageIndex: newPageIndex }, { merge: true });
      loadVideos(); // Refresh videos after update
    } catch (error) {
      console.error('Error updating video page index:', error);
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', maxHeight: '600px', overflowY: 'scroll' }}>
        {videos.map(video => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', boxShadow: '0 0 4px rgba(0,0,0,0.1)' }}>
            <h4>{video.title}</h4>
            <video width="300" height="200" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>Assigned to Page: {video.pageIndex}</p>
            <input type="number" min="1" value={video.pageIndex} onChange={(e) => handleVideoPageChange(video.id, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostPage;
