//import "../styles/layout.css";
import '../App.css';

export default function Navbar() {
  return (
    <nav className="navbar transparent-navbar">
      <div className="logo">
        <a href="/">
          <img src="/logo-image.png" alt="Logo" className="logo-image" />
        </a>
      </div>
      <div className="nav-links">
        <div className="nav-items">
        <a href="/">Home</a>
        <a href="/categories">Categories</a>
       </div>
        <a href="/login" className="button-18">Sign In</a>
        <a href="/profile" className="btn-nav">
          <img src="/profile-icon.png" alt="Profile" className="profile-icon" />

        </a>
      </div>
    </nav>
  );
}
