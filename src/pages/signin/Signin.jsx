import "./Signin.css";
import { useState, useEffect, useCallback } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

export default function Signin({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 🔴 NEW

  const navigate = useNavigate();
  const toggleTerms = () => setShowTerms(!showTerms);
  const togglePassword = () => setShowPassword(!showPassword);

  const goBackOrHome = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      goBackOrHome();
    }
  }, [goBackOrHome]);


    const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPhone = phone.startsWith("+") ? phone.substring(1) : phone;

    // clear old error
    setErrorMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        msisdn: cleanedPhone,
        password,
      });

      const token = res.data.data.token;
      localStorage.setItem("token", token);
      onLogin?.();

      goBackOrHome();
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // 🧠 Case 1: wrong phone / password (typically 401 or 422)
      if (
        error.response?.status === 401 ||
        error.response?.status === 422
      ) {
        setErrorMessage(
          error.response?.data?.message ||
            "Wrong phone number or password."
        );
        return; // ⬅️ don't go to sorry page
      }

      // 🧠 Case 2: other backend issues → go to sorry page
      navigate("/sorrypage", { state: { fromLogin: true } });
    }
  };
  return (
    <div className="body-image-signin">
      <FaArrowLeft className="back-arrow" onClick={() => navigate("/")} />

      <Link to="/">
        <img src="/gym-club-logo.png" alt="Logo" className="signin-logo" />
      </Link>

      <img src="/body-image2.jpg" alt="Image" className="body-img-signin" />

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Log in to your account</h2>

        <div className="phone-input-wrapper">
          <PhoneInput
            country={"lb"}
            value={phone}
            onChange={setPhone}
            inputClass="phone-input"
            containerClass="phone-container"
            inputStyle={{ width: "100%" }}
            enableSearch
          />
        </div>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="signin-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showPassword ? (
            <FaEyeSlash className="password-eye" onClick={togglePassword} />
          ) : (
            <FaEye className="password-eye" onClick={togglePassword} />
          )}
        </div>
        {errorMessage && (
          <p className="signin-error">{errorMessage}</p>
        )}

        <button type="submit" className="continue-button">Continue</button>


        <p className="signup-question">
          Don’t have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Create an account
          </span>
        </p>
      </form>

      <div className="terms-container">
        <button className="terms-toggle" onClick={toggleTerms}>
          Terms and Conditions
        </button>
        {showTerms && (
          <div className="terms-box">
            <p>
              Welcome to <strong>GYM CLUB.</strong>
            </p>
            <ul>
              <li>• Subscription cost is 30$/year.</li>
              <li>• 1 FREE day for new users.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
