import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState , useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../VideoPage.css";

export default function VideoPage() {
  const { videoId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { title, description, video, image } = state || {};
  const [isPlaying, setIsPlaying] = useState(false);

    const videoRef = useRef(null);
 // Scroll to video after it's shown
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      setTimeout(() => {
        videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100); // slight delay to ensure DOM update
    }
  }, [isPlaying]);
  if (!state || !video || !image) {
    return <div className="video-error">No video data found for "{videoId}"</div>;
  }

  return (
    <div className="video-container">
      {/* <div className="top-bar"> */}
      <div className="video-header">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
      <h1 className="video-title">{title}</h1>
      </div>


      <div className="video-thumbnail-wrapper">
        {!isPlaying ? (
          <div className="video-thumbnail">
  <img src={image} alt={title} className="video-thumbnail-img" />
  <div className="video-overlay">
    <p className="video-description">{description}</p>
    <p className="video-price">$99.00</p>
    <button className="subscribe-btn" onClick={() => setIsPlaying(true)}>
      SUBSCRIBE
    </button>
  </div>
</div>
        ) : (
          <video className="video-player" controls autoPlay ref={videoRef} // the video is here
> 
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

    </div>
  );
}
