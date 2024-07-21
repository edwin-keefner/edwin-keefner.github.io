import React from 'react';
import { Link } from 'react-router-dom';
import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const NavBar = ({ user, isHost }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
        <Link to="/upload">Upload Video</Link> {/* Add this line */}
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
