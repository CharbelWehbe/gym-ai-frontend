
import { useLocation, useParams,useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../VideoPage.css";

export default function VideoPage() {
  const { videoId } = useParams();
  const { state } = useLocation();
    const navigate = useNavigate();

  const { title, description, video, image,categoryId } = state || {};

  const [isPlaying, setIsPlaying] = useState(false);

  if (!state || !video || !image) {
    return <div className="video-error">No video data found for "{videoId}"</div>;
  }

  return (
    <div className="video-container">
        <button
        className="back-btn"
        onClick={() => navigate(`/categories/${categoryId}`)}
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="video-title">{title}</h1>

      <div className="video-player-wrapper">
        {!isPlaying ? (
          <div className="video-thumbnail" onClick={() => setIsPlaying(true)}>
            <img src={image} alt={title} className="video-thumbnail-img" />
            <div className="play-button-overlay">▶</div>
          </div>
        ) : (
          <video className="video-player" controls autoPlay>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {description && <p className="video-description">{description}</p>}
    </div>
  );
}














// import { useLocation, useParams } from "react-router-dom";
// import "../VideoPage.css";

// export default function VideoPage() {
//   const { videoId } = useParams();
//   const { state } = useLocation();
//   const { title,  description, video } = state || {};

//   if (!state || !video) {
//     return <div className="video-error">No video data found for "{videoId}"</div>;
//   }

//   return (
//     <div className="video-container">
//       <h1 className="video-title">{title}</h1>

//       {/* Video Player */}
//       <div className="video-player-wrapper">
//         <video className="video-player" controls>
//           <source src={video} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {description && <p className="video-description">{description}</p>}
//     </div>
//   );
// }
















// import { useLocation } from "react-router-dom";
// import "../VideoPage.css";

// export default function VideoPage() {
//   const location = useLocation();
//   const { title, image, description } = location.state || {};

//   if (!title || !image) {
//     return <div className="video-error">Video not found</div>;
//   }

//   return (
//     <div className="video-container">
//       <h1 className="video-title">{title}</h1>
//       <img src={image} alt={title} className="video-image" />
//       {description && <p className="video-description">{description}</p>}
//     </div>
//   );
// }
