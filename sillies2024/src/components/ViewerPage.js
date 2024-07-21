import React, { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, getDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import '../index.css';

const ViewerPage = () => {
  const [page, setPage] = useState('1');
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [videos, setVideos] = useState([]);
  const [videoPlayback, setVideoPlayback] = useState({ videoId: null, isPlaying: false });
  const videoRef = useRef(null);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'control', 'videoPlayback'), (doc) => {
      if (doc.exists()) {
        setVideoPlayback(doc.data());
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    if (videoRef.current && videoPlayback.videoId) {
      const video = videoRef.current;
      video.src = videos.find(v => v.id === videoPlayback.videoId)?.url || '';
      video[videoPlayback.isPlaying ? 'play' : 'pause']();
    }
  }, [videoPlayback, videos]);

  const filteredVideos = videos.filter(video => video.pageIndex === parseInt(page, 10));

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
            <video ref={videoRef} className="video-player" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-author">by {video.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerPage;
