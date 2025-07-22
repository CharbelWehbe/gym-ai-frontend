import './Categories.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const categories = [
  { id: 'strength', title: 'Strength training', image: '/gym-image-1.png', description: 'Sculpt and strengthen your body with our advanced equipment.' },
  { id: 'cardio', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Boost your stamina and endurance with tailored cardio plans.' },
  { id: 'flexibility', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Improve your joint and muscle mobility through stretching, enhancing movement, performance, and injury prevention.' },
  { id: 'body', title: 'Body Composition', image: '/gym-image-4.png', description: 'Enhance your overall health, boosts metabolism, increases strength, and promotes a leaner physique.' },
  { id: 'move', title: 'Move it', image: '/cat5.jpg', description: 'Our daily fitness classes are led by expert trainers and are varied to meet your needs and wishes.' },
  { id: 'cycle', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling, often called spin or cycle classes, are group fitness classes led by an instructor who guides participants through a series of exercises on stationary bikes.' },
  { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }
  , { id: 'mma', title: 'Mma', image: '/cat7.jpg', description: 'A comprehensive training experience that combines elements of various martial arts disciplines.' },
  { id: 'yoga', title: 'Yoga', image: '/cat8.jpg', description: 'A mind-body practice combining postures, breathing, and meditation for well-being.' },
  { id: 'cycle2', title: 'Lets cycle', image: '/cat6.jpg', description: 'Indoor cycling... again' },
  { id: 'move2', title: 'Move it', image: '/cat5.jpg', description: 'Daily fitness classes again.' },
  { id: 'mma2', title: 'Mma', image: '/cat7.jpg', description: 'Mixed martial arts revisit.' },
  { id: 'yoga2', title: 'Yoga', image: '/cat8.jpg', description: 'Yoga benefits again.' },
  { id: 'body2', title: 'Body Composition', image: '/gym-image-4.png', description: 'Lean body, better health.' },
  { id: 'flexibility2', title: 'Flexibility Programs', image: '/gym-image-3.png', description: 'Stretch more.' },
  { id: 'cardio2', title: 'Cardio Programs', image: '/gym-image-2.png', description: 'Cardio boost.' },
  { id: 'strength2', title: 'Strength training', image: '/gym-image-1.png', description: 'Lift again.' }

];

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleCategories = categories.slice(startIndex, endIndex);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

  return (
    <div className="cat-section">
      <h1 className="cat-title">Categories</h1>

      <div className="cat-grid" ref={containerRef}>
        {visibleCategories.map((cat, index) => (
          <div key={`${cat.id}-${index}`} className="cat-card">
            <Link to={`/categories/${cat.id}`}>
              <img src={cat.image} alt={cat.title} className="cat-img" />
            </Link>
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

export default Categories;
