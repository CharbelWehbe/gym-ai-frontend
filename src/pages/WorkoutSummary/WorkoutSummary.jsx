import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import "./WorkoutSummary.css";

const WorkoutSummary = () => {
  const { programId, dayNumber } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await API.get(
          `/workout-programs/${programId}/days/${dayNumber}/log`
        );
        setLog(res.data.log || null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            "Could not load workout summary."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [programId, dayNumber]);

  const formatSeconds = (sec) => {
    const s = sec || 0;
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  if (loading) {
    return <div className="summary-container">Loading...</div>;
  }

  if (error) {
    return <div className="summary-container error">{error}</div>;
  }

  if (!log) {
    return (
      <div className="summary-container">
        <p>No log found for this day.</p>
        <Link to="/today-workout">Back to today&apos;s workout</Link>
      </div>
    );
  }

  const exercises = log.exercises_summary || [];
  const totalTime = exercises.reduce(
    (sum, ex) => sum + (ex.total_time_seconds || 0),
    0
  );

  return (
    <div className="summary-container">
      <h1>Workout Summary</h1>
      <p>
        Program #{log.workout_program_id} · Day {dayNumber} · Date{" "}
        {log.date}
      </p>

      <p className="summary-total-time">
        Total time spent: {formatSeconds(totalTime)}
      </p>

      <div className="summary-exercise-list">
        {exercises.map((ex) => (
          <div key={ex.exercise_id} className="summary-exercise-card">
            <h3>{ex.exercise_name}</h3>
            <p>
              Sets completed: {ex.sets_completed}/{ex.sets_planned}
            </p>
            {ex.rest_seconds && (
              <p>Planned rest: {ex.rest_seconds} seconds</p>
            )}
            {ex.total_time_seconds != null && (
              <p>
                Time on this exercise:{" "}
                {formatSeconds(ex.total_time_seconds)}
              </p>
            )}

            {Array.isArray(ex.sets) && ex.sets.length > 0 && (
              <div className="summary-sets-table">
                <div className="summary-sets-header">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                </div>
                {ex.sets.map((s) => (
                  <div
                    key={s.setNumber}
                    className="summary-sets-row"
                  >
                    <span>{s.setNumber}</span>
                    <span>{s.weight || "-"}</span>
                    <span>{s.reps || "-"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
<div className="summary-actions">
  <Link to="/today-workout">Back to Today&apos;s Workout</Link>
  <Link to="/workout-history" className="summary-history-link">
    View full workout history
  </Link>
</div>
    </div>
  );
};

export default WorkoutSummary;
