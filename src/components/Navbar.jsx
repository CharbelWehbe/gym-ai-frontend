import '../App.css';
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Close the burger menu whenever route changes
  useEffect(() => {
    setIsOpen(false);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };
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
          <NavLink to="/favorites" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Favorites</NavLink>
          <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            <span className="mobile-label">My Profile</span>
          </NavLink>
        </div>

  {/* Conditionally show Sign In or Logout */}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="button-18">Logout</button>
        ) : (
          <NavLink to="/login" onClick={handleLinkClick} className={({ isActive }) => isActive ? "button-18 active-button" : "button-18"}>Sign In</NavLink>
        )}    
            {/* This profile icon shows ONLY on desktop */}
        <div className="profile-icon-desktop">
          <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? "btn-nav active-button" : "btn-nav"}>
            <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
          </NavLink>
        </div>


      </div>
    </nav>
  );
}
