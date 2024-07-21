import React, { useState } from 'react';
import { storage, firestore } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [pageIndex, setPageIndex] = useState(1);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(firestore, 'videos', file.name), {
        title,
        url,
        pageIndex,
        timestamp: new Date()
      });
      setTitle('');
      setFile(null);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept=".mp4, .mov" onChange={handleFileChange} />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" min="1" placeholder="Page Index" value={pageIndex} onChange={(e) => setPageIndex(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
