import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import HostPage from './components/HostPage';
import ViewerPage from './components/ViewerPage';
import UploadPage from './components/UploadPage';
import UploadSuccessPage from './components/UploadSuccessPage';
import NavBar from './components/NavBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import './index.css';

const App = () => {
  const [user] = useAuthState(auth);
  const isHost = user && user.email === 'hybyrn@gmail.com';

  return (
    <Router>
      <NavBar user={user} isHost={isHost} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={user ? <HostPage isHost={isHost} /> : <Navigate to="/" />} />
        <Route path="/viewer" element={user ? <ViewerPage /> : <Navigate to="/" />} />
        <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/" />} />
        <Route path="/upload-success" element={user ? <UploadSuccessPage /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
