import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css';
import { FaChevronRight } from "react-icons/fa";
import Layout from "../components/Layout";
import API from "../api";
import { ClipLoader } from "react-spinners";
import { portalId,BASE_IMAGE_URL } from "../config";

function App() {
  const [categories, setCategories] = useState([]);


  const [heroSlide, setHeroSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Load categories
        const categoryRes = await API.get(`/public/portals/${portalId}/categories`);
        const categoriesData = categoryRes.data.data || [];
        setCategories(categoriesData);

        //  Load hero slide directly from correct endpoint
        const heroRes = await API.get(`/public/portals/${portalId}/hero-slides`);
        const heroSlides = heroRes.data;

        if (Array.isArray(heroSlides) && heroSlides.length > 0) {
          setHeroSlide(heroSlides[0]); // just pick the first slide
        } else {
          console.warn("No hero slides found for portal");
        }

      } catch (error) {
        console.error("Error loading categories or hero slide:", error);
      } finally {
        setLoading(false); // stop loading spinner
      }
    };

    fetchData();
  }, []);



  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <ClipLoader color="#c31afb" size={40} speedMultiplier={1} />
        </div>
      ) : (
        <>

          {heroSlide && (
            <div className="body-image">
              <img
                src={`${BASE_IMAGE_URL}/${heroSlide.background_image}`}
                alt="Hero"
                className="body-img"
              />
              <div className="body-overlay">
                {heroSlide.subtitle && <p className="body-top-text">{heroSlide.subtitle}</p>}
                <h1 className="body-main-text">
                  {heroSlide.title?.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </h1>
                <Link to="/categories" className="view-classes-btn">View Classes</Link>
              </div>
            </div>
          )}

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
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.id} className="category-card">
                <Link to={`/categories/${cat.id}`}>
                  <img
                    src={`${BASE_IMAGE_URL}/${cat.image}`}
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
      )}
    </>
  );
}

export default App;
