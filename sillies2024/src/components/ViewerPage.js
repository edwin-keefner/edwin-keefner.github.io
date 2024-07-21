import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc, getDocs, collection } from 'firebase/firestore'; // Added getDocs and collection
import { firestore } from '../firebase';

const ViewerPage = () => {
  const [page, setPage] = useState('page1');
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'control', 'state'), (doc) => {
      if (doc.exists()) {
        setPage(doc.data().page);
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

  const filteredVideos = videos.filter(video => video.pageIndex === parseInt(page, 10));

  return (
    <div>
      <div>
        <h2>{pageData.title}</h2>
        <div>{pageData.content}</div>
      </div>
      <div className="page-number">
        Page {page}
      </div>
      <div>
        {filteredVideos.map(video => (
          <div key={video.id}>
            <h4>{video.title}</h4>
            <video width="320" height="240" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerPage;
