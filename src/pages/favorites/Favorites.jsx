import React, { useEffect, useState, useRef } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api";
import "./Favorites.css";
import { ClipLoader } from "react-spinners";

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {

    const fetchFavorites = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        if (token) {
          const res = await api.get("/favorites");
          setFavorites(res.data || []);
        } else {
          const guestFavs = JSON.parse(localStorage.getItem("guest_favorites")) || [];
          setFavorites(guestFavs);
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);


  const toggleFavorite = async (videoId) => {
    const token = localStorage.getItem("token");
    if (token) {
      const prevFavorites = [...favorites];
      const updatedFavorites = prevFavorites.filter((fav) => (fav.video?.id || fav.video_id) !== videoId);

      // Optimistic update
      setFavorites(updatedFavorites);

      const newTotalPages = Math.ceil(updatedFavorites.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      try {
        await api.delete(`/favorites/${videoId}`);
      } catch (error) {
        console.error("Error removing from favorites:", error.response?.data || error.message);
        setFavorites(prevFavorites); // rollback
      }
    } else {
      // Guest user: update localStorage
      const prevFavorites = [...favorites];
      const updatedFavorites = prevFavorites.filter((fav) => (fav.video?.id || fav.video_id || fav.id) !== videoId);
      localStorage.setItem("guest_favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);

      const newTotalPages = Math.ceil(updatedFavorites.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };


  // const isFavorited = (videoId) =>
  //   favorites.some((fav) => fav.video_id === videoId);
  const isFavorited = (videoId) =>
    favorites.some((fav) => (fav.video?.id || fav.video_id || fav.id) === videoId);

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleFavorites = favorites.slice(startIndex, endIndex);

  const handlePageClick = (page) => setCurrentPage(page);

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
          className={`pagination-number ${i === currentPage ? "active" : ""}`}
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

      {loading || favorites.length === 0 ? (
        <div className="centered-message">
          {loading ? (
            <ClipLoader
              color="#c31afb"
              loading={true}
              size={35}
              speedMultiplier={1}
            />
          ) : (
            <p>No favorites added.</p>
          )}
        </div>
      ) : (

        <div className="favorite-grid" ref={containerRef}>
          {visibleFavorites.map((item) => {
            const video = item.video || item; // fallback if guest favorites store full video directly
            const videoId = item.video_id || video.id; // get correct video ID

            return (
              <div key={video.id} className="favorite-card">
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(videoId);
                  }}
                  title="Remove from Favorites"
                >
                  {isFavorited(videoId) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart className="outlined-heart" />
                  )}
                </button>

                <Link
                  to={`/video/${video.id}`}
                  state={{
                    title: video.title,
                    description: video.description,
                    video: video.video_file
                      ? `http://localhost:8000/storage/${video.video_file}`
                      : null,
                    image: video.thumbnail_small
                      ? `http://localhost:8000/storage/${video.thumbnail_small}`
                      : video.thumbnail_big
                        ? `http://localhost:8000/storage/${video.thumbnail_big}`
                        : "/default-thumbnail.jpg",
                  }}
                  className="clickable-area"
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img
                    src={
                      video.thumbnail_small
                        ? `http://localhost:8000/storage/${video.thumbnail_small}`
                        : video.thumbnail_big
                          ? `http://localhost:8000/storage/${video.thumbnail_big}`
                          : "/default-thumbnail.jpg"
                    }
                    alt={video.title}
                    className="favorite-img"
                  />

                  <h3 className="favorite-category-title">
                    {video.title}
                    <FaChevronRight className="favorite-arrow" />
                  </h3>
                  {video.description && (
                    <p className="favorite-category-description">
                      {video.description}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}

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