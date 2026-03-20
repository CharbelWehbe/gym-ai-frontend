import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "../App.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* LEFT: Logo + text */}
        <div className="footer-brand">
          <div className="footer-brand-top">
            <div className="footer-logo-square">
              <span className="footer-logo-mark">G</span>
            </div>
            <span className="footer-brand-name">GYM CLUB</span>
          </div>
          <p className="footer-brand-text">
            Transform your body and mind with GYM CLUB. Your journey to
            greatness starts here.
          </p>
        </div>

        {/* MIDDLE: Quick Links + Programs */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <a href="/" className="footer-link">
              Home
            </a>
            <a href="#classes" className="footer-link">
              Classes
            </a>
            <a href="#pricing" className="footer-link">
              Pricing
            </a>
            <a href="#contact" className="footer-link">
              Contact
            </a>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Programs</h4>
            <span className="footer-link">HIIT Training</span>
            <span className="footer-link">Yoga</span>
            <span className="footer-link">CrossFit</span>
            <span className="footer-link">Personal Training</span>
          </div>
        </div>

        {/* RIGHT: Social icons */}
        <div className="footer-social">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-social-icons">
            <a href="#" className="footer-social-icon" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="footer-social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="footer-social-icon" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="footer-social-icon" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="footer-bottom">
        <p>© {year} GYM CLUB. All rights reserved.</p>
      </div>
    </footer>
  );
}
