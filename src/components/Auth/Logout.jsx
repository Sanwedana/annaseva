import React from 'react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out.');
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;