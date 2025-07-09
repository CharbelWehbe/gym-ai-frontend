// import React, { useEffect, useState } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import '../Favorites.css';

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem('favorites');
//     if (stored) setFavorites(JSON.parse(stored));
//     // Clear after loading so on next refresh it's gone
//     localStorage.removeItem('favorites');
//   }, []);

//   const toggleFavorite = (item) => {
//     const updated = favorites.filter(
//       (fav) => fav.title !== item.title || fav.image !== item.image
//     );
//     setFavorites(updated);
//   };

//   const isFavorited = (item) =>
//     favorites.some((fav) => fav.title === item.title && fav.image === item.image);

//   return (
//     <div className="favorite-container">
//       <h1 className="favorite-title">Favourites</h1>
//       <div className="favorite-grid">
//         {favorites.length === 0 ? (
//           <p className="cat404">No favorites added.</p>
//         ) : (
//           favorites.map((item, index) => (
//             <div key={index} className="favorite-card">
//               <button
//                 className="favorite-btn"
//                 onClick={() => toggleFavorite(item)}
//                 title="Remove from Favorites"
//               >
//                 {isFavorited(item) ? <FaHeart color="red" /> : <FaRegHeart className="outlined-heart" />}
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


import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
    // Clear after loading so on next refresh it's gone
    localStorage.removeItem('favorites');
  }, []);

  const toggleFavorite = (item) => {
    const updated = favorites.filter(
      (fav) => fav.title !== item.title || fav.image !== item.image
    );
    setFavorites(updated);
  };

  const isFavorited = (item) =>
    favorites.some((fav) => fav.title === item.title && fav.image === item.image);

  return (
    <div className="favorite-container">
      <h1 className="favorite-title">Favourites</h1>
      <div className="favorite-grid">
        {favorites.length === 0 ? (
          <p className="cat404">No favorites added.</p>
        ) : (
          favorites.map((item, index) => (
            <div key={index} className="favorite-card">
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(item)}
                title="Remove from Favorites"
              >
                {isFavorited(item) ? <FaHeart color="red" /> : <FaRegHeart className="outlined-heart" />}
              </button>
              <img src={item.image} alt={item.title} className="favorite-img" />
              <h3 className="favorite-category-title">{item.title}</h3>
              {item.description && (
                <p className="favorite-category-description">{item.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;







// import React, { useEffect, useState } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import '../Favorites.css';

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [removedItems, setRemovedItems] = useState([]);

//   // Load favorites on mount
//   useEffect(() => {
//     const stored = localStorage.getItem('favorites');
//     if (stored) {
//       setFavorites(JSON.parse(stored));
//     }

//     // Clear localStorage so next refresh shows removed version
//     localStorage.removeItem('favorites');
//   }, []);

//   // When heart clicked, hide the heart and remove from localStorage (for next refresh)
//   const toggleFavorite = (item) => {
//     setRemovedItems((prev) => [...prev, item]);

//     const updated = favorites.filter(
//       (fav) => !(fav.title === item.title && fav.image === item.image)
//     );
//     localStorage.setItem('favorites', JSON.stringify(updated));
//   };

//   const isFavorited = (item) =>
//     !removedItems.find(
//       (removed) =>
//         removed.title === item.title && removed.image === item.image
//     );

//   return (
//     <div className="favorite-container">
//       <h1 className="favorite-title">Favourites</h1>
//       <div className="favorite-grid">
//         {favorites.length === 0 ? (
//           <p className="cat404">No favorites added.</p>
//         ) : (
//           favorites.map((item, index) => (
//             <div key={index} className="favorite-card">
//               {isFavorited(item) && (
//                 <button
//                   className="favorite-btn"
//                   onClick={() => toggleFavorite(item)}
//                   title="Remove from Favorites"
//                 >
//                   <FaHeart color="red" />
//                 </button>
//               )}
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







// import React, { useEffect, useState } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import '../Favorites.css';

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [unliked, setUnliked] = useState([]);

//   useEffect(() => {
//     const stored = localStorage.getItem('favorites');
//     if (stored) {
//       setFavorites(JSON.parse(stored));
//     }
//   }, []);

//   const toggleFavorite = (item) => {
//     // Remove from both UI and localStorage
//     const updated = favorites.filter(
//       (fav) => !(fav.title === item.title && fav.image === item.image)
//     );
//     localStorage.setItem('favorites', JSON.stringify(updated));
//     setUnliked((prev) => [...prev, item]);
//   };

//   const isRemoved = (item) =>
//     unliked.some(
//       (fav) => fav.title === item.title && fav.image === item.image
//     );

//   return (
//     <div className="favorite-container">
//       <h1 className="favorite-title">Favourites</h1>
//       <div className="favorite-grid">
//         {favorites.length === 0 ? (
//           <p className="cat404">No favorites added.</p>
//         ) : (
//           favorites.map((item, index) => (
//             <div key={index} className="favorite-card">
//               {!isRemoved(item) ? (
//                 <button
//                   className="favorite-btn"
//                   onClick={() => toggleFavorite(item)}
//                   title="Remove from Favorites"
//                 >
//                   <FaHeart color="red" />
//                 </button>
//               ) : (
//                 <button className="favorite-btn" disabled>
//                   <FaRegHeart className="outlined-heart" />
//                 </button>
//               )}

//               <img src={item.image} alt={item.title} className="favorite-img" />
//               <h3 className="favorite-category-title">{item.title}</h3>

//               {item.description && (
//                 <p className="favorite-category-description">
//                   {item.description}
//                 </p>
//               )}

//               {isRemoved(item) && (
//                 <p className="removed-label">Removed. Refresh to update</p>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Favorites;


// import React, { useEffect, useState } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import '../Favorites.css';

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [unliked, setUnliked] = useState([]);

//   useEffect(() => {
//     const stored = localStorage.getItem('favorites');
//     if (stored) {
//       setFavorites(JSON.parse(stored));
//     }
//   }, []);

//   const toggleFavorite = (item) => {
//     const updated = favorites.filter(
//       (fav) => !(fav.title === item.title && fav.image === item.image)
//     );
//     localStorage.setItem('favorites', JSON.stringify(updated));
//     setUnliked((prev) => [...prev, item]);
//   };

//   const isRemoved = (item) =>
//     unliked.some(
//       (fav) => fav.title === item.title && fav.image === item.image
//     );

//   return (
//     <div className="favorite-container">
//       <h1 className="favorite-title">Favourites</h1>
//       <div className="favorite-grid">
//         {favorites.length === 0 ? (
//           <p className="cat404">No favorites added.</p>
//         ) : (
//           favorites.map((item, index) => (
//             <div key={index} className="favorite-card">
//               <button
//                 className="favorite-btn"
//                 onClick={() => toggleFavorite(item)}
//                 disabled={isRemoved(item)}
//                 title="Remove from Favorites"
//               >
//                 {isRemoved(item) ? (
//                   <FaRegHeart className="outlined-heart" />
//                 ) : (
//                   <FaHeart color="red" />
//                 )}
//               </button>

//               <img src={item.image} alt={item.title} className="favorite-img" />
//               <h3 className="favorite-category-title">{item.title}</h3>

//               {item.description && (
//                 <p className="favorite-category-description">
//                   {item.description}
//                 </p>
//               )}

//               {isRemoved(item) && (
//                 <p className="removed-label">Removed. Refresh to update</p>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Favorites;
