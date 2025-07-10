import '../App.css';
import { useState } from 'react';
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar transparent-navbar">
      <div className="logo">
        <NavLink to="/" onClick={handleLinkClick}>
          <img src="/logo-image.png" alt="Logo" className="logo-image" />
        </NavLink>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

       {/* Navigation Links */}
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <div className="nav-items">
          <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
          <NavLink to="/categories" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Categories</NavLink>
          <NavLink to="/favorites" onClick={handleLinkClick} className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>Favorites</NavLink>
        {/* <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>My Profile</NavLink> */}
        </div>

        <NavLink to="/login" onClick={handleLinkClick} className={({ isActive }) => isActive ? "button-18 active-button" : "button-18"}>Sign In</NavLink>
       {/* This profile icon shows ONLY on desktop */}
        <div className="profile-icon-desktop">
          <NavLink to="/profile" onClick={handleLinkClick} className="btn-nav">
            <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
          </NavLink>
        </div>
        

      </div>
    </nav>
  );
}
