import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../App.css";
import API from "../../api";
import { ClipLoader } from "react-spinners";
import { BASE_IMAGE_URL } from "../../config";

function App() {
  const [heroSlide, setHeroSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSlide = async () => {
      try {

        const heroRes = await API.get(`/hero-slides`);
        const heroSlides = heroRes.data;

        if (Array.isArray(heroSlides) && heroSlides.length > 0) {
          setHeroSlide(heroSlides[0]); // first slide
        } else {
          console.warn("No hero slides found");
        }
      } catch (error) {
        console.error("Error loading hero slide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlide();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <ClipLoader color="#f97316" size={40} speedMultiplier={1} />
        </div>
      ) : (
        <>
          {/* HERO SECTION */}
          {heroSlide && (
            <div className="body-image">
              <img
                src="/body-image2.jpg"
                alt="Hero"
                className="body-img"
              />

              <div className="body-overlay">
                {heroSlide.subtitle && (
                  <p className="body-top-text">{heroSlide.subtitle}</p>
                )}

                <h1 className="body-main-text">
                  {heroSlide.title?.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h1>

                <Link to="/scan" className="scan-button">
                  Scan Now
                </Link>
              </div>
            </div>
          )}

          {/* WHY CHOOSE SECTION */}
          <div className="info-section">
            <div className="info-left">
              <p className="info-text">WHY CHOOSE OUR GYM</p>
            </div>

            <div className="info-right">
              <div className="info-highlight">
                <h2 className="info-right-title">
                  Everything you need under one roof
                </h2>

                <p>
                  Train with modern equipment, guided workouts, and motivating
                  content – all designed to push you towards your full potential.
                </p>
              </div>

              <video className="promo-video" controls>
                <source src="/videos/gym-ad2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
