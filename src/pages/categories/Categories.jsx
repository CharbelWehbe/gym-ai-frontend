import './Categories.css';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import api from '../../api'; // Adjust path if needed

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  const portalId = 1; //  Replace with actual portal ID if needed

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/public/portals/${portalId}/categories`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleCategories = categories.slice(startIndex, endIndex);

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

      {loading ? (
        <p className="cat-loading">Loading categories...</p>
      ) : (
        <>
          <div className="cat-grid" ref={containerRef}>
            {visibleCategories.map((cat) => (
              <div key={cat.id} className="cat-card">
                <Link to={`/categories/${cat.id}`}>
                  <img
                    src={`http://localhost:8000/storage/${cat.image}`}
                    alt={cat.name}
                    className="cat-img"
                  />
                </Link>
                <h3 className="cat-card-title">
                  {cat.name}
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
        </>
      )}
    </div>
  );
};

export default Categories;
