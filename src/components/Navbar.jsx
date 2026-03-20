import '../App.css';
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on route change
  useEffect(() => {
    setIsOpen(false);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); 
    window.location.href = "/login"; // force refresh to reset state
  };

  return (
    
    <nav className="navbar transparent-navbar">
      {/* Logo */}
      <div className="logo">
        <NavLink to="/" onClick={handleLinkClick}>
 
                    <img src="/gym-club-logo.png" alt="Logo" className="logo-image" />

        </NavLink>
      </div>

      {/* Hamburger menu (mobile) */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <div className="nav-items">
        
          <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>

{/* AI Workout Plan – ONLY if logged in, next to the others */}
          {isAuthenticated && (
            <NavLink
              to="/ai-workout-plan"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
            >
              AI Workout Plan
            </NavLink>
          )}

  <Link to="/today-workout">Today&apos;s Workout</Link>
<Link to="/today-meal" className="nav-link">
  Today&apos;s Meal
</Link>

          {isAuthenticated && (
  <NavLink
    to="/progress"
    onClick={handleLinkClick}
    className={({ isActive }) =>
      isActive ? "nav-link active-link" : "nav-link"
    }
  >
    Progress
  </NavLink>
)}
          {/* Show Profile link ONLY if logged in */}
          {isAuthenticated && (
            <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              <span className="mobile-label">My Profile</span>
            </NavLink>
          )}
        </div>

        {/* Sign In / Logout button */}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="button-18">Logout</button>
        ) : (
          <NavLink to="/login" onClick={handleLinkClick} className={({ isActive }) => isActive ? "button-18 active-button" : "button-18"}>Sign In</NavLink>
        )}

        {/* Profile icon (desktop only) - shown only if logged in */}
        {isAuthenticated && (
          <div className="profile-icon-desktop">
            <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => isActive ? "btn-nav active-button" : "btn-nav"}>
              <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
