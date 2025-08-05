import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../api";
import "./Allvideos.css";
import { ClipLoader } from "react-spinners";
import { portalId,BASE_IMAGE_URL } from "../../config";

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const Allvideos = () => {
  const { categoryId } = useParams();
  const [videos, setVideos] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const containerRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const subRes = await api.get(`/public/portals/${portalId}/videos`, {
          params: { category_id: categoryId },
        });

        const videoList = Array.isArray(subRes.data?.data?.data)
          ? subRes.data.data.data
          : [];
        setVideos(videoList);

        const catRes = await api.get(`/public/categories/${categoryId}`);
        setCategoryName(catRes.data.data?.name || "Allvideos");

        if (isLoggedIn) {
          const favRes = await api.get("/favorites");
          setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
        } else {
          const localFavs = JSON.parse(localStorage.getItem("guest_favorites")) || [];
          setFavorites(localFavs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVideos([]);
        setCategoryName("Allvideos");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId, isLoggedIn]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollLeft = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
  const visibleVideos = videos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePageClick = (page) => setCurrentPage(page);

  const renderPagination = () => {
    let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
    let endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);

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


  const isFavorited = (video) => {
    return favorites.some(
      (fav) =>
        fav.video_id === video.id ||
        fav.id === video.id ||
        (fav.video && fav.video.id === video.id)
    );
  };


  const toggleFavorite = async (video) => {
    const isFav = isFavorited(video);

    if (isLoggedIn) {
      if (isFav) {
        setFavorites((prev) => prev.filter((fav) => fav.video_id !== video.id));
      } else {
        setFavorites((prev) => [...prev, { video_id: video.id }]);
      }

      try {
        if (isFav) {
          await api.delete(`/favorites/${video.id}`);
        } else {
          await api.post("/favorites", {
            video_id: video.id,
            portal_id: portalId,
          });
        }
      } catch (error) {
        console.error("Error updating favorites:", error);
        // Roll back the change if API fails
        if (isFav) {
          setFavorites((prev) => [...prev, { video_id: video.id }]);
        } else {
          setFavorites((prev) =>
            prev.filter((fav) => fav.video_id !== video.id)
          );
        }
      }
    } else {
      const updatedFavs = isFav
        ? favorites.filter((fav) => fav.id !== video.id)
        : [...favorites, video]; // store full video object

      localStorage.setItem("guest_favorites", JSON.stringify(updatedFavs));
      setFavorites(updatedFavs);
    }
  };


 return (
  <div className="allvideos-section">
    <h1 className="allvideos-title">{categoryName}</h1>

    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <ClipLoader color="#c31afb" loading={true} size={35} speedMultiplier={1} />
      </div>
    ) : (
      <>
        {videos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem", color: "#666" }}>
            No videos available in this category.
          </div>
        ) : (
          <div className="allvideos-grid" ref={containerRef}>
            {visibleVideos.map((video) => (
              <div key={video.id} className="allvideos-card" style={{ position: "relative" }}>
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(video)}
                  title={isFavorited(video) ? "Remove from Favorites" : "Add to Favorites"}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    fontSize: "1.5rem",
                    color: isFavorited(video) ? "red" : "black",
                  }}
                >
                  {isFavorited(video) ? <FaHeart /> : <FaRegHeart />}
                </button>

                <Link
                  to={`/video/${video.id}`}
                  state={{
                    title: video.title,
                    description: video.description,
                    video: video.video_file
                      ? `${BASE_IMAGE_URL}/${video.video_file}`
                      : null,
                    image: video.thumbnail_small
                      ? `${BASE_IMAGE_URL}/${video.thumbnail_small}`
                      : null,
                  }}
                >
                  <img
                    src={
                      video.thumbnail_small
                        ? `${BASE_IMAGE_URL}/${video.thumbnail_small}`
                        : "/placeholder-image.png"
                    }
                    alt={video.title}
                    className="allvideos-img"
                  />
                </Link>

                <div className="allvideos-card-title-wrapper">
                  <h3 className="allvideos-card-title">{video.title}</h3>
                  <Link
                    to={`/video/${video.id}`}
                    className="allvideos-arrow"
                    state={{
                      title: video.title,
                      description: video.description,
                      video: video.video_file
                        ? `${BASE_IMAGE_URL}/${video.video_file}`
                        : null,
                      image: video.thumbnail_small
                        ? `${BASE_IMAGE_URL}/${video.thumbnail_small}`
                        : null,
                    }}
                  >
                    <FaChevronRight />
                  </Link>
                </div>

                <p className="allvideos-description">{video.description}</p>
              </div>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="pagination-controls">
            <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
              <FaChevronLeft /> Prev
            </button>

            {renderPagination()}

            <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

};

export default Allvideos;
