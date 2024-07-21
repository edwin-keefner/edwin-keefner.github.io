import React, { useState } from 'react';
import { storage, firestore } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      // Fetch videos to find the next available page index
      const videosSnapshot = await getDocs(collection(firestore, 'videos'));
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const nextPageIndex = Math.max(...videosData.map(video => video.pageIndex), 0) + 1;
      
      await setDoc(doc(firestore, 'videos', file.name), {
        title,
        url,
        pageIndex: nextPageIndex,
        timestamp: new Date()
      });

      setTitle('');
      setFile(null);
      navigate('/upload-success'); // Redirect to success page
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept=".mp4, .mov" onChange={handleFileChange} />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
