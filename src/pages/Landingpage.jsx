import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css';
import { FaChevronRight } from "react-icons/fa";
import Layout from "../components/Layout";
import API from "../api";

function App() {
  const [categories, setCategories] = useState([]);

  const portalId = 1; // Adjust if dynamic

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get(`/public/portals/${portalId}/categories`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="body-image">
        <img src="/body-image.png" alt="Image" className="body-img" />
        <div className="body-overlay">
          <p className="body-top-text">
            Unleash your full potential in a state-of-the-art fitness environment tailored for every level
          </p>
          <h1 className="body-main-text">
            Your Ultimate <br /> Fitness Destination
          </h1>
          <Link to="/categories" className="view-classes-btn">View Classes</Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-left">
          <p className="info-text">First 3 days will be free then<br /> $99.00 per month</p>
        </div>
        <div className="info-right">
          <div className="info-highlight">
            <h2 className="info-right-title"> Don't Miss Out! </h2>
            Stay tuned for a day filled with <br />challenges, fun, and prizes.
          </div>
          <video className="promo-video" controls>
            <source src="/videos/gym-ad2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Categories Section */}
      <h1 className="categories-title">Categories</h1>
      <div className="categories-section">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <Link to={`/categories/${cat.id}`}>
              <img
                src={`http://localhost:8000/storage/${cat.image}`}
                alt={cat.name}
                className="category-img"
              />
            </Link>
            <h3 className="category-title">
              {cat.name}
              <Link to={`/categories/${cat.id}`} className="category-arrow">
                <FaChevronRight />
              </Link>
            </h3>
            <p className="category-paragraph">
              {cat.description?.split('\n').map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="viewmore-div">
        <Link to="/categories" className="arrow-button">
          View more<span className="arrow"></span>
        </Link>
      </div>
    </>
  );
}

export default App;

