// src/components/UploadPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (videoFile && author && title) {
      try {
        const storageRef = ref(storage, `videos/${videoFile.name}`);
        await uploadBytes(storageRef, videoFile);
        const downloadURL = await getDownloadURL(storageRef);
        await addDoc(collection(firestore, 'videos'), {
          url: downloadURL,
          author,
          title,
          pageIndex: 1 // Or any logic to determine the page index
        });
        navigate('/upload-success');
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  return (
    <div>
      <h2>Upload a Video</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
