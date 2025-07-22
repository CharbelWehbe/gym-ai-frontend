






import './Profile.css';
import image from "/avatar-icon.png";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import API from "../../api"; // <-- make sure this is your axios instance

export default function Profile() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    msisdn: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [loading] = useState(false);

  // ✅ Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/me');
        const data = res.data.data;
        setUser({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          dob: data.dob || '',
          msisdn: data.msisdn || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        setStatusMessage('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await API.put('/auth/profile', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dob: user.dob,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to update profile');
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setStatusMessage('');
  //   setLoading(true);

  //   try {
  //     await API.put('/auth/profile', {
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       email: user.email,
  //       dob: user.dob,
  //     });

  //     setStatusMessage(' Profile updated successfully!');
  //   } catch (error) {
  //     console.error('Update failed:', error.response?.data || error.message);
  //     setStatusMessage(' Failed to update profile.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="profile-container">
      <img src={image} alt="User Avatar" className="profile-img" />

      <div className="container-one">
        <h2 className="welcome-message">
          Welcome, {user.first_name} {user.last_name}
        </h2>
        <p className="date">{new Date().toDateString()}</p>
      </div>

      <div className="container-two">
        <h1 className="profile-account-information">Account Information</h1>
      </div>

      <div className="container-three">
        <p className="container-three-message">Update your account information</p>
      </div>

      <div className="form-container">
        <h2 className="form-title">Personal Information</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group icon-input">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleChange}
            />
            <MdOutlineCalendarToday className="input-icon" />
          </div>

          <div className="form-group icon-input">
            <label>Mobile Phone</label>
            <input
              type="text"
              value={user.msisdn}
              disabled
              readOnly
              className="read-only"
            />
            <FaPhoneAlt className="input-icon" />
          </div>

          <div className="form-group icon-input full-width">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <FaEnvelope className="input-icon" />
          </div>

          <div className="form-group full-width">
            <button
              type="submit"
              className="update-button"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>

          {statusMessage && (
            <div className="form-status">{statusMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
}

