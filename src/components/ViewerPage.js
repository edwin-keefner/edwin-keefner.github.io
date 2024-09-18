import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ViewerPage = () => {
  const [page, setPage] = useState('1'); // Default to '1'
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [videos, setVideos] = useState([]);
  const [isHost, setIsHost] = useState(false); // Add state for host check

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'control', 'state'), (doc) => {
      if (doc.exists()) {
        setPage(doc.data().page.toString()); // Ensure page is a string
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const pageDoc = doc(firestore, 'pages', page);
        const pageSnapshot = await getDoc(pageDoc);
        if (pageSnapshot.exists()) {
          setPageData(pageSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, [page]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosSnapshot = await getDocs(collection(firestore, 'videos'));
        const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  // Check if the current user is the host
  const checkIfHost = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsHost(user.email === 'hybyrn@gmail.com'); // Replace with actual host email
    }
  };

  useEffect(() => {
    checkIfHost(); // Check if user is host
  }, []);

  const filteredVideos = videos.filter(video => video.pageIndex === parseInt(page, 10));

  // Handle page change
  const handlePageChange = async (newPage) => {
    try {
      const docRef = doc(firestore, 'control', 'state');
      await setDoc(docRef, { page: newPage });
    } catch (error) {
      console.error('Error changing page:', error);
    }
  };

  return (
    <div className="viewer-container">
      <div className="page-info">
        <h2 className="page-title">{pageData.title}</h2>
        <div className="page-content">{pageData.content}</div>
      </div>
      <div className="video-container">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-item">
            <h4 className="video-title">{video.title}</h4>
            <video className="video-player" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-author">by {video.author}</div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {isHost && (
        <div className="navigation-buttons">
          <button
            onClick={() => handlePageChange(parseInt(page, 10) - 1)}
            disabled={parseInt(page, 10) <= 1}
          >
            Previous Page
          </button>
          <button
            onClick={() => handlePageChange(parseInt(page, 10) + 1)}
            disabled={parseInt(page, 10) >= (videos.length || 1)}
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewerPage;
