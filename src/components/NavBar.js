import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const NavBar = ({ user, isHost }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/">Home</Link>
        {user && <Link to="/viewer">Presentation</Link>}
        {user && isHost && <Link to="/host">Host Page</Link>}
        {user && <Link to="/upload">Upload Videos</Link>}
      </div>
      <div>
        {user ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn}>Login</button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
