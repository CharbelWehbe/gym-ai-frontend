import './SorryPage.css';
import { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signin() {
  const [showTerms, setShowTerms] = useState(false);

  const toggleTerms = () => setShowTerms(!showTerms);

  const navigate = useNavigate();

  return (
    <div className="body-image-sorrypage">
      <FaArrowLeft className="back-arrow-sorrypage" onClick={() => navigate("/")} />
      <Link to="/">
        <img src="/logo-image.png" alt="Logo" className="sorrypage-logo" />
      </Link>
      <img src="/body-image.png" alt="Image" className="body-img-sorrypage" />

      <h2 className="sorry-message">Sorry, you cannot<br /> subscribe to the service</h2>



      {/* Terms toggle */}
      <div className="terms-container-sorrypage">
        <button className="terms-toggle-sorrypage" onClick={toggleTerms}>
          Terms and Conditions
        </button>
        {showTerms && (
          <div className="terms-box-sorrypage">
            <p>Welcome to
              <strong> FITNESS+.</strong>
              <br />
              By subscribing, you agree to the terms and conditions below:
            </p>
            <ul>
              <li>• Subscribing cost is 30$/year.</li>
              <li>• New subscribers get one day free.</li>
              <li>
                • After that, the subscription is renewed automatically.
              </li>
              <li>
                • To cancel the subscription, send PE to 6657 for
                free.
              </li>
              <li>• For support and more info: contact@fitnessplus.co</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
