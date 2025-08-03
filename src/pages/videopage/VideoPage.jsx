import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../api";
import "./VideoPage.css";

export default function VideoPage() {
  const { videoId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const [videoData, setVideoData] = useState({
    title: state?.title || "",
    description: state?.description || "",
    video: state?.video || "",
    image: state?.image || "",
  });
  const [loading, setLoading] = useState(!state);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!state) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/public/videos/${videoId}`);
          const data = res.data.data;

          setVideoData({
            title: data.title,
            description: data.description,
            video: `http://localhost:8000/storage/${data.video_file}`,
            image: `http://localhost:8000/storage/${data.thumbnail_small || data.thumbnail_big}`,
          });
        } catch (err) {
          console.error("Error fetching video:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchVideo();
    }
  }, [videoId, state]);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      setTimeout(() => {
        videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isPlaying]);

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsPlaying(true);
  };

  if (loading) {
    return <div className="video-loading">Loading video...</div>;
  }

 
if (!videoData.video || !videoData.image) {
  return (
    <div className="centered-message">
      No video data found for "{videoData.title}"
    </div>
  );
}

  return (
    <div className="video-container">
      <div className="video-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="video-title">{videoData.title}</h1>
      </div>

      <div className="video-thumbnail-wrapper">
        {!isPlaying ? (
          <div className="video-thumbnail">
            <img src={videoData.image} alt={videoData.title} className="video-thumbnail-img" />
            <div className="video-overlay">
              <p className="video-description">{videoData.description}</p>
              <button className="subscribe-btn" onClick={handleButtonClick}>
                {isLoggedIn ? "Play" : "Subscribe"}
              </button>
            </div>
          </div>
        ) : (
          <video className="video-player" controls autoPlay ref={videoRef}>
            <source src={videoData.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
