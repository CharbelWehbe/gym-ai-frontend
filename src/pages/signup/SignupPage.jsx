import React, { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    msisdn: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // password validation
    if (!/^(?=.*\d).{8,}$/.test(form.password)) {
      setError("Password must be at least 8 characters and contain a number.");
      setLoading(false);
      return;
    }

    const cleanedPhone = form.msisdn.startsWith("+")
      ? form.msisdn.substring(1)
      : form.msisdn;

    try {
      const res = await API.post("/auth/register", {
        ...form,
        msisdn: cleanedPhone,
      });

      const token = res.data.data.token;
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="body-image-signup">

      <FaArrowLeft className="back-arrow" onClick={() => navigate("/login")} />

      <img src="/body-image2.jpg" alt="Background" className="body-img-signup" />

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Your Account</h2>

        {error && <p className="signup-error">{error}</p>}

        <input
          type="text"
          name="msisdn"
          placeholder="Phone Number"
          className="signup-input"
          value={form.msisdn}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="signup-input"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="signup-input"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="signup-input"
            value={form.password}
            onChange={handleChange}
            required
          />

          {showPassword ? (
            <FaEyeSlash className="password-eye" onClick={togglePassword} />
          ) : (
            <FaEye className="password-eye" onClick={togglePassword} />
          )}
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="signup-input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dob"
          className="signup-input"
          value={form.dob}
          onChange={handleChange}
          required
        />

        <button type="submit" className="continue-button" disabled={loading}>
          {loading ? "Submitting..." : "Sign Up"}
        </button>

        <p className="signin-question">
          Already have an account?
          <span className="signin-link" onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}
