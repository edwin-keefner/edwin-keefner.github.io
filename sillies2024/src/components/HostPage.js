import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase';

const HostPage = () => {
  const [pages, setPages] = useState({});

  useEffect(() => {
    // Load pages when component mounts
    loadPages();
  }, []);

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

  const handlePageChange = async (newPage) => {
    try {
      await setDoc(doc(firestore, 'control', 'state'), { page: newPage });
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const handleUpdatePage = async (pageId, newTitle, newContent) => {
    try {
      await setDoc(doc(firestore, 'pages', pageId), { title: newTitle, content: newContent });
      loadPages(); // Refresh pages after update
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  return (
    <div>
      <h2>Host Page</h2>
      <button onClick={() => handlePageChange('page1')}>Set Page 1</button>
      <button onClick={() => handlePageChange('page2')}>Set Page 2</button>
      <div>
        <h3>Manage Pages</h3>
        {Object.entries(pages).map(([id, page]) => (
          <div key={id}>
            <h4>{page.title}</h4>
            <p>{page.content}</p>
            {/* Add form or controls to update pages */}
            <button onClick={() => handleUpdatePage(id, 'New Title', 'New Content')}>Update Page</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostPage;
