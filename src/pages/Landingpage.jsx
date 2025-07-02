import { Routes, Route } from "react-router-dom";
import '../App.css'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function App() {
  const categories = [
    { id: 'strength', title: 'Strength training', image: '/gym-image-1.png', description: 'Sculpt and strengthen your body with our advanced equipment.' },
    { id: 'cardio', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Boost your stamina and endurance with tailored cardio plans.' },
    { id: 'flexibility', title: 'flexibility programs', image: '/gym-image-3.png', description: 'Improve your joint and muscle mobility through stretching, enhancing movement, performance, and injury prevention.' },
    { id: 'body', title: 'body composition', image: '/gym-image-4.png', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.' },
  ];

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
          <video className="promo-video" controls>
            <source src="/gym-ad2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="info-highlight">
            <h2 className="info-right-title"> Don't Miss Out! </h2>
            Stay tuned for a day filled with <br />challenges, fun, and prizes.
          </p>
        </div>
      </div>


      {/* Categories Section */}
      <div className="categories-section">
         <h1 className="categories-title">Categories</h1>
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <img src={cat.image} alt={cat.title} className="category-img" />
            <h3 className="category-title">{cat.title}
                <Link to={`/categories/${cat.id}`} className="category-arrow">
                      <FaChevronRight />
                </Link>          
              </h3>
            <p className="category-paragraph">
              {cat.description.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

        ))}

          <Link to="/categories" className="arrow-button">
                 View more<span className="arrow"></span>
          </Link>



      </div>
    </>
  );
}

export default App;
