import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../api";
import "./VideoPage.css";
import { BASE_IMAGE_URL,BASE_URL } from "../../config";

export default function VideoPage() {
  const { videoId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const [videoData, setVideoData] = useState({
    title: state?.title || "",
    description: state?.description || "",
    image: state?.image || "",
  });
  const [loading, setLoading] = useState(!state);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);

  // Fetch metadata if not passed from previous page
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
            image: `${BASE_IMAGE_URL}/${data.thumbnail_small || data.thumbnail_big}`,
          });
        } catch (err) {
          console.error("Error fetching video metadata:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [videoId, state]);

  // Scroll to player when video starts
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      setTimeout(() => {
        videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isPlaying]);

  // Clean up blob URL when component unmounts or video changes
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleButtonClick = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setIsPlaying(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/videos/${videoId}/stream`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load video stream");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      // Wait a tick before setting video src
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = url;
        }
      }, 0);
    } catch (err) {
      console.error("Error streaming video:", err);
    }
  };

  if (loading) {
    return <div className="video-loading">Loading video...</div>;
  }

  if (!videoData.title || !videoData.image) {
    return (
      <div className="centered-message">
        No video data found.
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
            <img
              src={videoData.image}
              alt={videoData.title}
              className="video-thumbnail-img"
            />
            <div className="video-overlay">
              <p className="video-description">{videoData.description}</p>
              <button className="subscribe-btn" onClick={handleButtonClick}>
                {isLoggedIn ? "Play" : "Subscribe"}
              </button>
            </div>
          </div>
        ) : (
          <video
            className="video-player"
            ref={videoRef}
            controls
            autoPlay
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}