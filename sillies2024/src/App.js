import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import HostPage from './components/HostPage';
import ViewerPage from './components/ViewerPage';
import UploadPage from './components/UploadPage'; // Import UploadPage component
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
        <Route path="/host" element={<HostPage isHost={isHost} />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/upload" element={<UploadPage />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;
