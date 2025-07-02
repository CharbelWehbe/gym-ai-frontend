//import "../styles/layout.css";
import '../App.css';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar transparent-navbar">
      <div className="logo">
        <Link to="/" onClick={handleLinkClick}>
          <img src="/logo-image.png" alt="Logo" className="logo-image" />
        </Link>
      </div>
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
       {/* Navigation Links */}
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <div className="nav-items">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/categories" onClick={handleLinkClick}>Categories</Link>
        </div>
        <Link to="/login" className="button-18" onClick={handleLinkClick}>Sign In</Link>
        <Link to="/profile" className="btn-nav" onClick={handleLinkClick}>
          <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
        </Link>
      </div>
    </nav>
  );
}
