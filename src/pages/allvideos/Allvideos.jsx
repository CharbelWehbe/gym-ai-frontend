import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../api";
import "./Allvideos.css";
import { ClipLoader } from "react-spinners";

const ITEMS_PER_PAGE = 8;
const PAGE_WINDOW = 5;
const portalId = 1;

const Allvideos = () => {
  const { categoryId } = useParams();
  const [videos, setVideos] = useState([]);
  const [categoryName, setCategoryName] = useState("Allvideos");
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
    return favorites.some((fav) => fav.video_id === video.id);
  };

  const toggleFavorite = async (video) => {
    const isFav = isFavorited(video);

    if (isLoggedIn) {
      try {
        if (isFav) {
          await api.delete(`/favorites/${video.id}`);
          setFavorites((prev) => prev.filter((fav) => fav.video_id !== video.id));
        } else {
          await api.post("/favorites", {
            video_id: video.id,
            portal_id: portalId,
          });
          setFavorites((prev) => [...prev, { video_id: video.id }]);
        }
      } catch (error) {
        console.error("Error updating favorites:", error);
      }
    } else {
      const updatedFavs = isFav
        ? favorites.filter((fav) => fav.video_id !== video.id)
        : [...favorites, { video_id: video.id }];
      localStorage.setItem("guest_favorites", JSON.stringify(updatedFavs));
      setFavorites(updatedFavs);
    }
  };

  return (
    <div className="cat-section">
      <h1 className="cat-title">{categoryName}</h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <ClipLoader color="#c31afb" loading={true} size={35} speedMultiplier={1} />
        </div>
      ) : (
        <>
          <div className="cat-grid" ref={containerRef}>
            {visibleVideos.map((video) => (
              <div key={video.id} className="cat-card" style={{ position: "relative" }}>
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
                    color: isFavorited(video) ? "red" : "grey",
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
                      ? `http://localhost:8000/storage/${video.video_file}`
                      : null,
                    image: video.thumbnail_small
                      ? `http://localhost:8000/storage/${video.thumbnail_small}`
                      : null,
                  }}
                >
                  <img
                    src={
                      video.thumbnail_small
                        ? `http://localhost:8000/storage/${video.thumbnail_small}`
                        : "/placeholder-image.png"
                    }
                    alt={video.title}
                    className="cat-img"
                  />
                </Link>

                <h3 className="cat-card-title">
                  {video.title}
                  <Link to={`/Allvideos/${video.id}`} className="cat-arrow">
                    <FaChevronRight />
                  </Link>
                </h3>
                <p className="cat-description">{video.description}</p>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
              <FaChevronLeft /> Prev
            </button>

            {renderPagination()}

            <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
              Next <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Allvideos;
















////////////////////////////cant go to all videos without loginn/////////////////////////////
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { FaChevronRight, FaChevronLeft, FaHeart, FaRegHeart } from "react-icons/fa";
// import api from "../../api";
// import "./Allvideos.css";

// const ITEMS_PER_PAGE = 8;
// const PAGE_WINDOW = 5;
// const portalId = 1;

// const Allvideos = () => {
//   const { categoryId } = useParams();
//   const [videos, setVideos] = useState([]);
//   const [categoryName, setCategoryName] = useState("Allvideos");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [favorites, setFavorites] = useState([]);

//   const containerRef = useRef(null);

//   useEffect(() => {
//     const fetchCategoryData = async () => {
//       setLoading(true);
//       try {
//         const subRes = await api.get(`/public/portals/${portalId}/videos`, {
//           params: { category_id: categoryId },
//         });

//         // Here is the fix: use paginated data array
//         const paginatedData = subRes.data?.data;
//         const videoList = Array.isArray(paginatedData?.data) ? paginatedData.data : [];

//         setVideos(videoList);

//         const catRes = await api.get(`/public/categories/${categoryId}`);
//         setCategoryName(catRes.data.data?.name || "Allvideos");

//         const favRes = await api.get("/favorites");
//         setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setVideos([]);
//         setCategoryName("Allvideos");
//         setFavorites([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryData();
//   }, [categoryId]);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = 0;
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [currentPage]);

//   const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const visibleVideos = videos.slice(startIndex, endIndex);

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
//           className={`pagination-number ${i === currentPage ? "active" : ""}`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pages;
//   };

//   const isFavorited = (item) =>
//     favorites.some((fav) => fav.item_name === item.title);

//   const toggleFavorite = async (item) => {
//     const isFav = isFavorited(item);
//     try {
//       if (isFav) {
//         setFavorites((prev) => prev.filter((fav) => fav.item_name !== item.title));
//         await api.delete(`/favorites/${encodeURIComponent(item.title)}`);
//       } else {
//         setFavorites((prev) => [
//           ...prev,
//           {
//             item_name: item.title,
//             item_image: `http://localhost:8000/storage/${item.thumbnail_small}`,
//           },
//         ]);
//         await api.post("/favorites", {
//           item_name: item.title,
//           item_image: `http://localhost:8000/storage/${item.thumbnail_small}`,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//     }
//   };

//   return (
//     <div className="cat-section">
//       <h1 className="cat-title">{categoryName}</h1>

//       {loading ? (
//         <p className="cat-loading">Loading videos...</p>
//       ) : videos.length === 0 ? (
//         <p>No videos found.</p>
//       ) : (
//         <>
//           <div className="cat-grid" ref={containerRef}>
//             {visibleVideos.map((video) => (
//               <div key={video.id} className="cat-card" style={{ position: "relative" }}>
//                 <button
//                   className="favorite-btn"
//                   onClick={() => toggleFavorite(video)}
//                   title={isFavorited(video) ? "Remove from Favorites" : "Add to Favorites"}
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     left: "10px",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     zIndex: 10,
//                     fontSize: "1.5rem",
//                     color: isFavorited(video) ? "red" : "grey",
//                   }}
//                 >
//                   {isFavorited(video) ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                <Link
//   to={`/video/${video.id}`}
//   state={{
//     title: video.title,
//     description: video.description,
//     video: video.video_file ? `http://localhost:8000/storage/${video.video_file}` : null,
//     image: video.thumbnail_small ? `http://localhost:8000/storage/${video.thumbnail_small}` : null,
//   }}
// >
//   <img
//     src={video.thumbnail_small ? `http://localhost:8000/storage/${video.thumbnail_small}` : "/placeholder-image.png"}
//     alt={video.title}
//     className="cat-img"
//   />
// </Link>

//                 <h3 className="cat-card-title">
//                   {video.title}
//                   <Link to={`/Allvideos/${video.id}`} className="cat-arrow">
//                     <FaChevronRight />
//                   </Link>

//                 </h3>
//                 <p className="cat-description">{video.description}</p>
//               </div>
//             ))}
//           </div>

//           <div className="pagination-controls">
//             <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
//               <FaChevronLeft /> Prev
//             </button>

//             {renderPagination()}

//             <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
//               Next <FaChevronRight />
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Allvideos;














///////////working but without heart button////////////
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
// import api from "../../api";
// import "./Allvideos.css";

// const ITEMS_PER_PAGE = 8;
// const PAGE_WINDOW = 5;

// const Allvideos = () => {
//   const { categoryId } = useParams();
//   const [subcategories, setSubcategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("Subcategories");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const containerRef = useRef(null);

//   const portalId = 1;

//   useEffect(() => {
//     const fetchCategoryData = async () => {
//       setLoading(true);
//       try {
//         // Fetch subcategories
//         const subRes = await api.get(
//           `/public/portals/${portalId}/categories/${categoryId}/subcategories`
//         );
//         setSubcategories(subRes.data.data || []);

//         // Fetch category name
//         const catRes = await api.get(`/public/categories/${categoryId}`);
//         setCategoryName(catRes.data.data?.name || "Subcategories");
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setSubcategories([]);
//         setCategoryName("Subcategories");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryData();
//   }, [categoryId]);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = 0;
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [currentPage]);

//   const totalPages = Math.ceil(subcategories.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const visibleSubcategories = subcategories.slice(startIndex, endIndex);

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
//           className={`pagination-number ${i === currentPage ? "active" : ""}`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="cat-section">
//       <h1 className="cat-title">{categoryName}</h1>

//       {loading ? (
//         <p className="cat-loading">Loading subcategories...</p>
//       ) : subcategories.length === 0 ? (
//         <p>No subcategories found.</p>
//       ) : (
//         <>
//           <div className="cat-grid" ref={containerRef}>
//             {visibleSubcategories.map((subcat) => (
//               <div key={subcat.id} className="cat-card">
//                 <Link to={`/subcategories/${subcat.id}`}>
//                   <img
//                     src={`http://localhost:8000/storage/${subcat.image}`}
//                     alt={subcat.name}
//                     className="cat-img"
//                   />
//                 </Link>
//                 <h3 className="cat-card-title">
//                   {subcat.name}
//                   <Link to={`/subcategories/${subcat.id}`} className="cat-arrow">
//                     <FaChevronRight />
//                   </Link>
//                 </h3>
//                 <p className="cat-description">{subcat.description}</p>
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
//       )}
//     </div>
//   );
// };

// export default Allvideos;















//////////////////////working but the names in subcat not fixed///////////////
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
// import api from "../../api"; // same api instance you shared
// import './Allvideos.css';

// const ITEMS_PER_PAGE = 8;
// const PAGE_WINDOW = 5;

// const Allvideos = () => {
//   const { categoryId } = useParams(); // expects route param :categoryId
//   const [subcategories, setSubcategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const containerRef = useRef(null);

//   // Replace this with your actual portal ID if dynamic
//   const portalId = 1;

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       setLoading(true);
//       try {
//         // Use the *public* route if you want unauthenticated access
// const res = await api.get(`/public/portals/${portalId}/categories/${categoryId}/subcategories`);

//         setSubcategories(res.data.data || []);
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//         setSubcategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubcategories();
//   }, [categoryId]);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = 0;
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [currentPage]);

//   const totalPages = Math.ceil(subcategories.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const visibleSubcategories = subcategories.slice(startIndex, endIndex);

//   const handlePageClick = (page) => {
//     setCurrentPage(page);
//   };

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
//           className={`pagination-number ${i === currentPage ? "active" : ""}`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="cat-section">
//       <h1 className="cat-title">Subcategories</h1>

//       {loading ? (
//         <p className="cat-loading">Loading subcategories...</p>
//       ) : subcategories.length === 0 ? (
//         <p>No subcategories found.</p>
//       ) : (
//         <>
//           <div className="cat-grid" ref={containerRef}>
//             {visibleSubcategories.map((subcat) => (
//               <div key={subcat.id} className="cat-card">
//                 <Link to={`/subcategories/${subcat.id}`}>
//                   <img
//                     src={`http://localhost:8000/storage/${subcat.image}`}
//                     alt={subcat.name}
//                     className="cat-img"
//                   />
//                 </Link>
//                 <h3 className="cat-card-title">
//                   {subcat.name}
//                   <Link to={`/subcategories/${subcat.id}`} className="cat-arrow">
//                     <FaChevronRight />
//                   </Link>
//                 </h3>
//                 <p className="cat-description">{subcat.description}</p>
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
//       )}
//     </div>
//   );
// };

// export default Allvideos;































// import "./Allvideos.css";
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../api";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ITEMS_PER_PAGE = 8;
// const PAGE_WINDOW = 5;

// export default function Allvideos() {
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
