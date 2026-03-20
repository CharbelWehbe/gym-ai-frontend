import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import "./WorkoutHistory.css";

const WorkoutHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/workout-history");
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            "Could not load workout history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatSeconds = (sec) => {
    const s = sec || 0;
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  if (loading) {
    return <div className="history-container">Loading...</div>;
  }

  if (error) {
    return <div className="history-container error">{error}</div>;
  }

  if (!logs.length) {
    return (
      <div className="history-container">
        <p>No workouts logged yet.</p>
        <Link to="/today-workout">Go to Today&apos;s Workout</Link>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1>Your Workout History</h1>
      <p>All completed days across your programs.</p>

      <div className="history-list">
        {logs.map((log) => (
          <Link
            key={log.id}
            to={`/workout-summary/${log.program_id}/${log.day_number}`}
            className="history-card-link"
          >
            <div className="history-card">
              <div className="history-card-main">
                <div>
                  <h3>
                    {log.day_name || `Day ${log.day_number}`} ·{" "}
                    {log.date}
                  </h3>
                  <p>
                    Goal: {log.goal || "N/A"} · Program #
                    {log.program_id}
                  </p>
                </div>
                {log.is_completed && (
                  <span className="history-card-badge">Done</span>
                )}
              </div>
              <p className="history-card-meta">
                Time: {formatSeconds(log.total_time_seconds)} · Sets
                completed: {log.total_sets_completed}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="history-actions">
        <Link to="/today-workout">Back to Today&apos;s Workout</Link>
      </div>
    </div>
  );
};

export default WorkoutHistory;
