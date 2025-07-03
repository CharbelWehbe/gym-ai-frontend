import '../Signin.css';
import { useState } from 'react';

export default function Signin() {
  const [countryCode, setCountryCode] = useState('+961');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullNumber = `${countryCode}${phone}`;
    console.log("Phone number:", fullNumber);
    // handle continue logic here
  };

  return (
      <div className="body-image-signin">
      <img src="/body-image.png" alt="Image" className="body-img-signin" />

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Enter your mobile number to receive an OTP</h2>

        <div className="phone-input-wrapper">
          <select
            className="country-code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+961">+961</option>
            <option value="+1">+1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+33">🇫🇷 +33</option>
            {/* Add more as needed */}
          </select>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="phone-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
}
