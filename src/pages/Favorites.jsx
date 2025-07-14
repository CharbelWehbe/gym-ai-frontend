import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart,FaChevronRight  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (item) => {
    const updated = favorites.filter(
      (fav) => fav.title !== item.title || fav.image !== item.image
    );
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorited = (item) =>
    favorites.some((fav) => fav.title === item.title && fav.image === item.image);

 return (
    <div className="favorite-container">
      <h1 className="favorite-title">Favorites</h1>
      <div className="favorite-grid">
        {favorites.length === 0 ? (
          <p className="cat404">No favorites added.</p>
        ) : (
          favorites.map((item, index) => (
            <div key={index} className="favorite-card">
              {/* Heart Button - Do NOT trigger navigation */}
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation(); // stop click bubbling to card
                  toggleFavorite(item);
                }}
                title="Remove from Favorites"
              >
                {isFavorited(item) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart className="outlined-heart" />
                )}
              </button>

              {/* Clickable area for video preview */}
              <div
                className="clickable-area"
                onClick={() =>
                  navigate(`/videopage/${encodeURIComponent(item.title)}`, {
                    state: {
                      ...item,
                    },
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                <img src={item.image} alt={item.title} className="favorite-img" />


                <h3 className="favorite-category-title">{item.title}

                                    <FaChevronRight className="favorite-arrow" />

                </h3>
                {item.description && (
                  <p className="favorite-category-description">{item.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;






//   return (
//     <div className="favorite-container">
//       <h1 className="favorite-title">Favorites</h1>
//       <div className="favorite-grid">
//         {favorites.length === 0 ? (
//           <p className="cat404">No favorites added.</p>
//         ) : (
//           favorites.map((item, index) => (
//             <div key={index} className="favorite-card"  onClick={() =>
//                 navigate(`/videopage/${encodeURIComponent(item.title)}`, {
//                   state: {
//                     ...item,
//                   },
//                 })
//               }
//               style={{ cursor: 'pointer' }}
//             >
//               <button
//                 className="favorite-btn"
//                 onClick={() => toggleFavorite(item)}
//                 title="Remove from Favorites"
//               >
//                 {isFavorited(item) ? (
//                   <FaHeart color="red" />
//                 ) : (
//                   <FaRegHeart className="outlined-heart" />
//                 )}
//               </button>
//               <img src={item.image} alt={item.title} className="favorite-img" />
//               <h3 className="favorite-category-title">{item.title}</h3>
//               {item.description && (
//                 <p className="favorite-category-description">{item.description}</p>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Favorites;
