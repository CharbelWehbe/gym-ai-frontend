import './Signin.css';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Signin() {
  // const [countryCode] = useState('+961');
  const [phone, setPhone] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const toggleTerms = () => setShowTerms(!showTerms);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const fullNumber = phone; // match exactly what’s in DB
  console.log("Phone number (msisdn):", fullNumber);

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      msisdn: fullNumber,
    });

    const token = res.data.data.token;
    localStorage.setItem('token', token);
    // alert('Login successful!');
    navigate(-1);
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    // alert('Login failed: Invalid phone number or server error.');
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
