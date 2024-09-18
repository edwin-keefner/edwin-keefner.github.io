// src/components/UploadSuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const UploadSuccessPage = () => {
  return (
    <div>
      <h2>Upload Successful!</h2>
      <p>Your video has been uploaded successfully.</p>
      <Link to="/upload">Upload Another Video</Link>
    </div>
  );
};

export default UploadSuccessPage;
