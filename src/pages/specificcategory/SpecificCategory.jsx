import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import './SpecificCategory.css';

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
      { title: 'Flexibility Vid1', image: '/flexprog1.jpg', description: 'Sculpt and strengthen your body with our advanced equipment.', video: '/videos/gym-ad.mp4' },
      { title: 'Flexibility Vid2', image: '/flexprog2.jpg', description: 'Boost your stamina and endurance with tailored cardio plans.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid3', image: '/flexprog3.jpg', description: 'Improve your joint and muscle mobility through stretching, enhancing movement, performance, and injury prevention.', video: '/videos/gym-ad.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid4', image: '/flexprog4.jpg', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid5', image: '/flexprog5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid6', image: '/flexprog6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid7', image: '/flexprog7.jpg', description: 'A comprehensive training experience combining various martial arts disciplines.', video: '/videos/gym-ad2.mp4' },
      { title: 'Flexibility Vid8', image: '/flexprog8.jpg', description: 'A mind-body practice combining physical postures, breathing techniques, and meditation.', video: '/videos/gym-ad2.mp4' },
    ],
  },
};

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const SpecificCategory = () => {
  const { categoryId } = useParams();
  const category = categoryData[categoryId];
  const containerRef = useRef(null);
  const gridRef = useRef(null);      // detail-grid - add this

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 480; // or 430

    if (isMobile && gridRef.current) {
      // Scroll the horizontal scroll container to left=0 on page change
      gridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (containerRef.current) {
      // Scroll detail-container vertically into view for desktop
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(category?.items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleItems = category?.items.slice(startIndex, endIndex);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
    let endPage = startPage + PAGE_WINDOW - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`pagination-number ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const toggleFavorite = (item) => {
    const exists = favorites.find(
      (fav) => fav.title === item.title && fav.image === item.image
    );
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.title !== item.title));
    } else {
      setFavorites([...favorites, { ...item, categoryId }]);
    }
  };

  const isFavorited = (item) =>
    favorites.some((fav) => fav.title === item.title && fav.image === item.image);

  if (!category) return <h2 className="cat404">Category not found</h2>;

  return (
    <div className="detail-container" ref={containerRef}>
      <h1 className="detail-title">{category.title}</h1>
      <div className="detail-grid" ref={gridRef}>
        {visibleItems.map((item, index) => (
          <div key={index} className="detail-card">
            <button
              className="favorite-btn"
              onClick={() => toggleFavorite(item)}
              title="Add to Favorites"
            >
              {isFavorited(item) ? <FaHeart color="red" /> : <FaRegHeart className="outlined-heart" />}
            </button>

            <Link
              to={`/videopage/${encodeURIComponent(item.title)}`}
              state={{
                title: item.title,
                image: item.image,
                description: item.description,
                video: item.video,
                categoryId: categoryId,
              }}
              className="detail-img-link"
            >
              <img src={item.image} alt={item.title} className="detail-img" />
            </Link>

            <h3 className="Specific-category-title">
              {item.title}
              <Link
                to={`/videopage/${encodeURIComponent(item.title)}`}
                state={{
                  title: item.title,
                  image: item.image,
                  description: item.description,
                  video: item.video,
                  categoryId: categoryId,
                }}
                className="arrow-icon"
                title="View Video"
              >
                <FaChevronRight />
              </Link>
            </h3>

            {item.description && (
              <p className="Specific-category-description">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> Prev
        </button>

        {renderPagination()}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SpecificCategory;




// import "./SpecificCategory.css";
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../api";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ITEMS_PER_PAGE = 8;
// const PAGE_WINDOW = 5;

// export default function SpecificCategory() {
//   const { categoryId } = useParams();
//   const [category, setCategory] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await api.get(`/public/categories/${categoryId}`);
//         const categoryData = response.data?.data;

//         setCategory(categoryData);
//         setVideos(categoryData?.videos || []);
//       } catch (error) {
//         console.error("Error fetching specific category:", error);
//       }
//     };

//     fetchCategory();
//   }, [categoryId]);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = 0;
//     }
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [currentPage]);

//   const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const visibleVideos = videos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const handlePageClick = (page) => setCurrentPage(page);

//   const renderPagination = () => {
//     let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
//     let endPage = startPage + PAGE_WINDOW - 1;

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
//     }

//     const pages = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           onClick={() => handlePageClick(i)}
//           className={`pagination-number ${i === currentPage ? 'active' : ''}`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="detail-container">
//       {category ? (
//         <>
//           <h1 className="detail-title">{category.name}</h1>
//           <p className="detail-description">{category.description}</p>

//           <div className="detail-grid" ref={containerRef}>
//             {visibleVideos.map((video) => (
//               <div key={video.id} className="detail-card">
//                 <img
//                   src={`http://localhost:8000/storage/${video.image}`}
//                   alt={video.title}
//                   className="detail-img"
//                 />
//                 <h3 className="detail-card-title">{video.title}</h3>
//               </div>
//             ))}
//           </div>

//           <div className="pagination-controls">
//             <button
//               onClick={() => handlePageClick(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               <FaChevronLeft /> Prev
//             </button>

//             {renderPagination()}

//             <button
//               onClick={() => handlePageClick(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next <FaChevronRight />
//             </button>
//           </div>
//         </>
//       ) : (
//         <p className="cat-loading">Loading category details...</p>
//       )}
//     </div>
//   );
// }
