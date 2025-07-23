import React, { useEffect, useState, useRef } from 'react';
import { FaHeart, FaRegHeart, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleFavorite = (item) => {
    const updated = favorites.filter(
      (fav) => fav.title !== item.title || fav.image !== item.image
    );
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));

    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages === 0 ? 1 : newTotalPages);
    }
  };

  const isFavorited = (item) =>
    favorites.some((fav) => fav.title === item.title && fav.image === item.image);

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleFavorites = favorites.slice(startIndex, endIndex);

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
    <div className="favorite-container">
      <h1 className="favorite-title">Favorites</h1>
      <div className="favorite-grid" ref={containerRef}>
        {favorites.length === 0 ? (
          <p className="cat404">No favorites added.</p>
        ) : (
          visibleFavorites.map((item, index) => (
            <div key={index} className="favorite-card">
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
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

              <div
                className="clickable-area"
                onClick={() =>
                  navigate(`/videopage/${encodeURIComponent(item.title)}`, {
                    state: { ...item },
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                <img src={item.image} alt={item.title} className="favorite-img" />
                <h3 className="favorite-category-title">
                  {item.title}
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

      {favorites.length > ITEMS_PER_PAGE && (
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
      )}
    </div>
  );
};

export default Favorites;
