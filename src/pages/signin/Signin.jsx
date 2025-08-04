import './Signin.css';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useLocation } from "react-router-dom";

export default function Signin() {
  // const [countryCode] = useState('+961');
  const [phone, setPhone] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const toggleTerms = () => setShowTerms(!showTerms);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  console.log("from:",from);

const handleSubmit = async (e) => {
  e.preventDefault();
  const fullNumber = phone;

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      msisdn: fullNumber,
    });

    const token = res.data.data.token;
    localStorage.setItem('token', token);

    const portalId = localStorage.getItem("portal_id");

    // Migrate guest favorites to logged-in user
    const guestFavorites = JSON.parse(localStorage.getItem('guest_favorites')) || [];

    for (const fav of guestFavorites) {
      const videoId = fav.video_id || fav.id; // handle both guest shapes

      try {
        await axios.post(
          'http://127.0.0.1:8000/api/favorites',
          {
            video_id: videoId,
            portal_id: portalId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
      } catch (err) {
        console.warn(`Could not migrate favorite video ${videoId}`, err);
      }
    }

    localStorage.removeItem('guest_favorites'); // ✅ cleanup after syncing

    navigate(-1); // or: navigate(from, { replace: true });
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    navigate('/sorrypage');
  }
};

  return (
    <div className="body-image-signin">
      <FaArrowLeft className="back-arrow" onClick={() => navigate("/")} />
      <Link to="/">
        <img src="/logo-image.png" alt="Logo" className="signin-logo" />
      </Link>
      <img src="/body-image.png" alt="Image" className="body-img-signin" />

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Enter your mobile number to receive an OTP</h2>

        <div className="phone-input-wrapper">
          <PhoneInput
            country={'lb'}
            value={phone}
            onChange={setPhone}
            inputClass="phone-input"
            containerClass="phone-container"
            inputStyle={{ width: '100%' }}
            // countryCodeEditable={false}
            enableSearch={true}
          />
        </div>
        <button type="submit" className="continue-button">Continue</button>
      </form>

      <div className="terms-container">
        <button className="terms-toggle" onClick={toggleTerms}>
          Terms and Conditions
        </button>
        {showTerms && (
          <div className="terms-box">
            <p>Welcome to
              <strong> FITNESS+.</strong>
              <br />
              By subscribing, you agree to the terms and conditions below:
            </p>
            <ul>
              <li>• Subscribing cost is 30$/year.</li>
              <li>• New subscribers get one day free.</li>
              <li>• After that, the subscription is renewed automatically.</li>
              <li>• To cancel the subscription, send PE to 6657 for free.</li>
              <li>• For support and more info: contact@fitnessplus.co</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
