import '../Profile.css'
import image from "/avatar-icon.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";

const Profile = () => {
  return (
    <div className="profile-container">
      <img src={image} alt="Not fund" className="profile-img"></img>
      <div className="container-one">
        <h2 className="welcome-message"> Welcome, Alexa A.</h2>
        <p className="date"> Tue, 07 June 2022 </p>
      </div>
      <div className="container-two">
        <h1 className="profile-account-information">Account Information</h1>
      </div>
      <div className="container-three">
        <p className="container-three-message">
          Update your account information
        </p>
      </div>
      <div className="form-container">
        <h2 className="form-title">Personal Information</h2>
        <form className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" placeholder="Alexa" />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" placeholder="Andriana" />
          </div>

          <div className="form-group icon-input">
            <label>Date of Birth</label>
            <input type="date" />
            <MdOutlineCalendarToday className="input-icon" />
          </div>

          <div className="form-group icon-input">
            <label>Mobile Phone</label>
            <input type="text" placeholder="+12 3456 7890" disabled/>
            <FaPhoneAlt className="input-icon" />
          </div>

          <div className="form-group icon-input full-width">
            <label>Email</label>
            <input type="email" placeholder="alexaandriana@gmail.com" />
            <FaEnvelope className="input-icon" />
          </div>

          <div className="form-group full-width">
            <button type="submit" className="update-button">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;