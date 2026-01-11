import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-logo">
          𝗔𝗻𝗻𝗮𝗦𝗲𝘃𝗮
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;