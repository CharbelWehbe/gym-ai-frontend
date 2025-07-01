import '../Categories.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";

const categories = [
  { id: 'strength', title: 'Strength training', image: '/gym-image-1.png', description: 'Sculpt and strengthen your body with our advanced equipment.' },
  { id: 'cardio', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Boost your stamina and endurance with tailored cardio plans.' },
  { id: 'flexibility', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Improve your joint and muscle mobility through stretching, enhancing movement, performance, and injury prevention.' },
  { id: 'body', title: 'Body Composition', image: '/gym-image-4.png', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.' },
  { id: 'move', title: 'Move it', image: '/cat5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.' },
  { id: 'cycle', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor who guides participants through a series of exercises on stationary bikes.' },
  { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'a comprehensive training experience that combines elements of various martial arts disciplines, like boxing, wrestling, Muay Thai, and Brazilian Jiu-Jitsu' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'a mind-body practice combining physical postures (asanas), breathing techniques (pranayama), and meditation to promote physical and mental well-being.' },
];

/*
const Categories = () => {
  return (
    <div className="categories-section">
      <h1 className="categories-title">Categories</h1>
      {categories.map((cat) => (
        <div key={cat.id} className="category-card">
          <img src={cat.image} alt={cat.title} className="category-img" />
          <h3 className="category-title">
            {cat.title}
            <Link to={`/categories/${cat.id}`} className="category-arrow">
              <FaChevronRight />
            </Link>
          </h3>
          <p className="category-paragraph">
            {cat.description}
          </p>
        </div>
      ))}
    </div>
  );
};
*/

const Categories = () => {
  return (
    <div className="cat-section">
      <h1 className="cat-title">Categories</h1>
      <div className="cat-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="cat-card">
            <img src={cat.image} alt={cat.title} className="cat-img" />
            <h3 className="cat-card-title">
              {cat.title}
              <Link to={`/categories/${cat.id}`} className="cat-arrow">
                <FaChevronRight />
              </Link>
            </h3>
            <p className="cat-description">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

