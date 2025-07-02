import React from 'react';
import { useParams } from 'react-router-dom';
import '../SpecificCategory.css'; 

const categoryData = {
  strength: {
    title: 'Strength Training',
    items: [
      { title: 'Deadlifts', image: '/strength1.png' },
      { title: 'Bench Press', image: '/strength2.png' },
      { title: 'Squats', image: '/strength3.png' },
      { title: 'Overhead Press', image: '/strength4.png' },
      { title: 'Lunges', image: '/strength5.png' },
      { title: 'Barbell Rows', image: '/strength6.png' },
      { title: 'Pull-ups', image: '/strength7.png' },
      { title: 'Leg Press', image: '/strength8.png' },
    ],
  },
  cardio: {
    title: 'Cardio Programs',
    items: [
      { title: 'Treadmill', image: '/cardio1.png' },
      { title: 'Elliptical', image: '/cardio2.png' },
      { title: 'HIIT Sprint', image: '/cardio3.png' },
      { title: 'Cycling', image: '/cardio4.png' },
      { title: 'Stair Climber', image: '/cardio5.png' },
      { title: 'Jump Rope', image: '/cardio6.png' },
      { title: 'Rowing', image: '/cardio7.png' },
      { title: 'Zumba', image: '/cardio8.png' },
    ],
  },
  flexibility: {
    title: 'Flexibility Programs',
    items: [
      { title: 'Flexibility Vid1', image: '/flexprog1.jpg', description: 'Sculpt and strengthen your body with our advanced equipment.' },
      { title: 'Flexibility Vid2', image: '/flexprog2.jpg', description: 'Boost your stamina and endurance with tailored cardio plans.' },
      { title: 'Flexibility Vid3', image: '/flexprog3.jpg', description: 'Improve your joint and muscle mobility through stretching, enhancing movement, performance, and injury prevention.' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg',  description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg',description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor who guides participants through a series of exercises on stationary bikes.' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'a comprehensive training experience that combines elements of various martial arts disciplines, like boxing, wrestling, Muay Thai, and Brazilian Jiu-Jitsu' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'a mind-body practice combining physical postures (asanas), breathing techniques (pranayama), and meditation to promote physical and mental well-being.'     },
    ],
  },
  // Add the rest: flexibility, body, hiit, core, dance, rehab...
};

const SpecificCategory = () => {
  const { categoryId } = useParams();
  const category = categoryData[categoryId];

  if (!category) return <h2 className="cat404">Category not found</h2>;

  return (
    <div className="detail-container">
      <h1 className="detail-title">{category.title}</h1>
      <div className="detail-grid">
        {category.items.map((item, index) => (
          <div key={index} className="detail-card">
            <img src={item.image} alt={item.title} className="detail-img" />
            <h3 className="Specific-category-title">{item.title}</h3>

            <p className="Specific-category-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificCategory;
