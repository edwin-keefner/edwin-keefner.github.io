import React, { useState } from 'react';
import { storage, firestore } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [videos, setVideos] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const videosSnapshot = await getDocs(collection(firestore, 'videos'));
      const pageIndex = videosSnapshot.docs.length + 1;
      await setDoc(doc(firestore, 'videos', file.name), {
        title,
        author,
        url,
        pageIndex,
        timestamp: new Date()
      });
      setTitle('');
      setFile(null);
      setAuthor('');
      window.location.href = '/upload-success'; // Redirect to success page
    }
  };

  const loadVideos = async () => {
    const videosSnapshot = await getDocs(collection(firestore, 'videos'));
    const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVideos(videosData);
  };

  React.useEffect(() => {
    loadVideos();
  }, []);

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept=".mp4, .mov" onChange={handleFileChange} />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;
