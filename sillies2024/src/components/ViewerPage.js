import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const ViewerPage = () => {
  const [page, setPage] = useState('page1');
  const [pageData, setPageData] = useState({ title: '', content: '' });

  useEffect(() => {
    // Listen for changes to the current page
    const unsubscribe = onSnapshot(doc(firestore, 'control', 'state'), (doc) => {
      if (doc.exists()) {
        setPage(doc.data().page);
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  useEffect(() => {
    // Fetch page data when page changes
    const fetchPageData = async () => {
      try {
        const pageDoc = doc(firestore, 'pages', page);
        const pageSnapshot = await getDoc(pageDoc);
        if (pageSnapshot.exists()) {
          setPageData(pageSnapshot.data());
        } else {
          setPageData({ title: 'Page not found', content: '' });
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, [page]);

  return (
    <div>
      <div>
        <h2>{pageData.title}</h2>
        <div>{pageData.content}</div>
      </div>
      <div className="page-number">
        Page {page === 'page1' ? '1' : '2'} {/* Adjust if you have more pages */}
      </div>
    </div>
  );
};

export default ViewerPage;
