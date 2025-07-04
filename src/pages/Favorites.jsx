/*import React, { useEffect, useState } from 'react';

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <div className="detail-container">
      <h1 className="detail-title">Favourites</h1>
      <div className="detail-grid">
        {favorites.map((item, index) => (
          <div key={index} className="detail-card">
            <img src={item.image} alt={item.title} className="detail-img" />
            <h3 className="Specific-category-title">{item.title}</h3>
            {item.description && (
              <p className="Specific-category-description">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
*/