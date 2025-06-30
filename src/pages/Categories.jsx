// src/pages/Categories.jsx
/*
import { useState } from "react";

const categories = [
  {
    id: 'yoga',
    title: 'Strength Training',
    image: '/gym-image-1.png',
    description: 'Strength Training focuses on building muscle and strength using resistance.'
  },
  {
    id: 'cardio',
    title: 'Cardio Programs',
    image: '/gym-image-2.png',
    description: 'Cardio Programs help improve your heart health and burn fat.'
  },
  {
    id: 'strength',
    title: 'Flexibility Programs',
    image: '/gym-image-3.png',
    description: 'Flexibility Programs improve mobility and prevent injury.'
  },
  {
    id: 'dance',
    title: 'Body Composition',
    image: '/gym-image-4.png',
    description: 'Body Composition focuses on balancing muscle and fat for overall fitness.'
  },
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="categories-section">
      {!selectedCategory ? (
        categories.map((cat) => (
          <div key={cat.id} className="category-card" onClick={() => handleSelect(cat)}>
            <img src={cat.image} alt={cat.title} className="category-img" />
            <h3 className="category-title">{cat.title}</h3>
            <p className="category-paragraph">{cat.description}</p>
            <div className="category-arrow">→</div>
          </div>
        ))
      ) : (
        <div className="category-detail">
          <button onClick={() => setSelectedCategory(null)} className="button-18 mb-4">← Back to Categories</button>
          <h2 className="text-2xl font-bold mb-2">{selectedCategory.title}</h2>
          <img src={selectedCategory.image} alt={selectedCategory.title} className="w-full h-64 object-cover mb-4" />
          <p className="text-white text-base leading-relaxed">{selectedCategory.description}</p>
        </div>
      )}
    </div>
  );
}
*/
export default function Categories() {
 
   <h1>All Categories Page</h1>;
  
  
}

