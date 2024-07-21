// HostPage.js

import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Adjust the path as needed
import { collection, doc, setDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth to use firebase.auth()

// Your component logic here

const HostPage = () => {
  const [pages, setPages] = useState({});
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [editTitle, setEditTitle] = useState({});
  const [editAuthor, setEditAuthor] = useState({});
  const [editPageIndex, setEditPageIndex] = useState({});
  const [isHost, setIsHost] = useState(false); // Add state for host check

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
      setMaxPages(videosData.length || 1); // Set max pages based on number of videos
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  // Check if the current user is the host
  const checkIfHost = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsHost(user.email === 'hybyrn@gmail.com'); // Replace with actual host email
    }
  };

  // Change the current page in Firestore
  const handlePageChange = async (newPage) => {
    try {
      await setDoc(doc(firestore, 'control', 'state'), { page: newPage });
      setCurrentPage(newPage);
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  // Update video metadata in Firestore
  const handleVideoUpdate = async (videoId, updatedFields) => {
    try {
      await setDoc(doc(firestore, 'videos', videoId), updatedFields, { merge: true });
      // Reload videos to reflect changes, except for delete
      if (!updatedFields.deleted) {
        loadVideos(); 
      }
    } catch (error) {
      console.error('Error updating video metadata:', error);
    }
  };

  // Delete a video from Firestore
  const handleVideoDelete = async (videoId) => {
    try {
      await deleteDoc(doc(firestore, 'videos', videoId));
      // Refresh the video list after deletion
      loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  // Handle text input change for title
  const handleTitleChange = (videoId, value) => {
    setEditTitle(prev => ({ ...prev, [videoId]: value }));
  };

  // Handle text input change for author
  const handleAuthorChange = (videoId, value) => {
    setEditAuthor(prev => ({ ...prev, [videoId]: value }));
  };

  // Handle page index change
  const handlePageIndexChange = async (videoId, value) => {
    const pageIndex = parseInt(value, 10);
    if (isNaN(pageIndex) || pageIndex < 1 || pageIndex > maxPages) return;

    // Update the page index in Firestore
    await handleVideoUpdate(videoId, { pageIndex });

    // Update local state
    setEditPageIndex(prev => ({ ...prev, [videoId]: pageIndex }));
  };

  useEffect(() => {
    const fetchCurrentPage = async () => {
      const docSnap = await getDoc(doc(firestore, 'control', 'state'));
      if (docSnap.exists()) {
        setCurrentPage(docSnap.data().page);
      }
    };

    loadPages();
    loadVideos();
    fetchCurrentPage();
    checkIfHost(); // Check if user is host
  }, []);

  return (
    <div>
      <h2>Host Page</h2>
      <div>
        {/* Removed Previous and Next Page buttons */}
        <div>Current Page: {currentPage}</div>
      </div>

      <h3>Manage Videos</h3>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-grid-item">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={editTitle[video.id] || video.title}
                onChange={(e) => handleTitleChange(video.id, e.target.value)}
              />
              <button onClick={() => handleVideoUpdate(video.id, { title: editTitle[video.id] || video.title })}>Update Title</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Author"
                value={editAuthor[video.id] || video.author}
                onChange={(e) => handleAuthorChange(video.id, e.target.value)}
              />
              <button onClick={() => handleVideoUpdate(video.id, { author: editAuthor[video.id] || video.author })}>Update Author</button>
            </div>
            <video width="320" height="240" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <input
              type="number"
              min="1"
              max={maxPages}
              placeholder="Page Index"
              value={editPageIndex[video.id] || video.pageIndex}
              onChange={(e) => handlePageIndexChange(video.id, e.target.value)}
            />
            <button onClick={() => handleVideoDelete(video.id)}>
              Delete Video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostPage;
