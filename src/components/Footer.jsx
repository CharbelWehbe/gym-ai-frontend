//import "../styles/layout.css";
import '../App.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line">
      <p className="footertext">
      &copy; {new Date().getFullYear()}. All Rights Reserved. Terms and Conditions Apply.
      </p>
      </div>
      </footer>

  );
}
