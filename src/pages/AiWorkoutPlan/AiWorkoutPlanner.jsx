import React, { useState, useEffect } from "react";
import API from "../../api";
import "./AiWorkoutPlanner.css";
import { Link } from "react-router-dom";

/* ---------- helper: age from dob ---------- */

const calculateAgeFromDob = (dobString) => {
  if (!dobString) return "";
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const AiWorkoutPlanner = () => {
  const [form, setForm] = useState({
    gender: "male",
    age: 23,
    height_cm: 175,
    weight_kg: 78,
    goal: "build muscle and lose fat",
    fitness_level: "intermediate",
    days_per_week: 4,
    injuries: "",
    diet_preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null); // structured JSON from backend
  const [programId, setProgramId] = useState(null);
  const [startMessage, setStartMessage] = useState("");

  // 👉 Auto-fill AGE from /auth/me dob
  useEffect(() => {
    const preloadAge = async () => {
      try {
        const res = await API.get("/auth/me");
        const dob = res.data?.data?.dob;
        if (dob) {
          const age = calculateAgeFromDob(dob);
          if (age) {
            setForm((prev) => ({ ...prev, age }));
          }
        }
      } catch (err) {
        console.error("Could not preload age from profile", err);
      }
    };

    preloadAge();
  }, []);

  // 👉 Prefill from latest metrics in backend (if exists)
  useEffect(() => {
    const fetchLatestMetrics = async () => {
      try {
        const res = await API.get("/fitness-metrics/latest");
        const m = res.data.metric;
        if (m) {
          setForm((prev) => ({
            ...prev,
            gender: m.gender || prev.gender,
            age: m.age ?? prev.age,
            height_cm: m.height_cm ?? prev.height_cm,
            weight_kg: m.weight_kg ?? prev.weight_kg,
            goal: m.goal || prev.goal,
          }));
        }
      } catch (err) {
        console.error("Could not load latest metrics:", err);
      }
    };

    fetchLatestMetrics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan(null);
    setProgramId(null);
    setStartMessage("");

    try {
      const res = await API.post("/ai/workout-plan", form);
      setPlan(res.data.plan || null);
      setProgramId(res.data.program_id || null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Something went wrong while generating the plan."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartProgram = async () => {
    if (!programId) return;
    setStartMessage("");
    setError("");

    try {
      // 1) Start the program
      await API.post(`/workout-programs/${programId}/start`);

      // 2) Save baseline metrics snapshot in BACKEND
      await API.post("/fitness-metrics", {
        program_id: programId,
        gender: form.gender,
        age: Number(form.age) || null,
        height_cm: Number(form.height_cm) || null,
        weight_kg: Number(form.weight_kg) || null,
        goal: form.goal,
      });

      setStartMessage(
        "Program started! Open Today’s Workout and Today’s Meals to follow your plan."
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Could not start the program. Please try again."
      );
    }
  };

  return (
    <div className="ai-planner-page">
      <div className="ai-planner-container">
        <h1 className="ai-planner-title">AI Workout &amp; Diet Planner</h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="ai-form">
          <div className="ai-form-grid">
            <div className="ai-form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="ai-form-select"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ai-form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="ai-form-input"
              />
            </div>

            <div className="ai-form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                value={form.height_cm}
                onChange={handleChange}
                className="ai-form-input"
              />
            </div>

            <div className="ai-form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                value={form.weight_kg}
                onChange={handleChange}
                className="ai-form-input"
              />
            </div>

            <div className="ai-form-group full-width">
              <label>Goal</label>
              <input
                type="text"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="ai-form-input"
                placeholder="build muscle, lose fat, etc."
              />
            </div>

            <div className="ai-form-group">
              <label>Fitness level</label>
              <select
                name="fitness_level"
                value={form.fitness_level}
                onChange={handleChange}
                className="ai-form-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="ai-form-group">
              <label>Days per week to train</label>
              <input
                type="number"
                name="days_per_week"
                value={form.days_per_week}
                onChange={handleChange}
                min={1}
                max={7}
                className="ai-form-input"
              />
            </div>

            <div className="ai-form-group full-width">
              <label>Injuries / limitations</label>
              <input
                type="text"
                name="injuries"
                value={form.injuries}
                onChange={handleChange}
                className="ai-form-input"
                placeholder="none, knee pain, shoulder, etc."
              />
            </div>

            <div className="ai-form-group full-width">
              <label>Diet preferences</label>
              <input
                type="text"
                name="diet_preferences"
                value={form.diet_preferences}
                onChange={handleChange}
                className="ai-form-input"
                placeholder="halal, vegetarian, high protein..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ai-generate-button"
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </form>

        {error && <div className="ai-error-box">{error}</div>}
        {startMessage && (
          <div className="ai-success-box">{startMessage}</div>
        )}

        {/* OUTPUT */}
        {plan && (
          <div className="ai-plan-output-wrapper">
            <div className="ai-plan-output-title">
              Your AI-Generated Program
            </div>

            {/* Overview */}
            {plan.overview && (
              <div className="ai-section">
                <h2>Overview</h2>
                <p>{plan.overview.summary}</p>
                {plan.overview.notes && <p>{plan.overview.notes}</p>}
              </div>
            )}

            {/* Workout */}
            <div className="ai-section">
              <h2>Week 1 – Workout Plan</h2>
              <div className="ai-days-grid">
                {plan.week_workout?.map((day) => (
                  <div key={day.day_number} className="ai-day-card">
                    <h3>{day.day_name}</h3>
                    {day.is_rest_day ? (
                      <p>Rest / Active recovery</p>
                    ) : (
                      <ul>
                        {day.exercises?.map((ex, idx) => (
                          <li key={idx}>
                            <strong>{ex.exercise_name}</strong>
                            {ex.muscle_group && ` (${ex.muscle_group})`} –{" "}
                            {ex.sets && `${ex.sets} sets`}{" "}
                            {ex.reps && `× ${ex.reps}`}
                            {ex.rest_seconds &&
                              ` · rest ${ex.rest_seconds}s between sets`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Diet */}
            <div className="ai-section">
              <h2>7-Day Diet Plan</h2>
              <div className="ai-days-grid">
                {plan.diet_plan?.map((d) => (
                  <div key={d.day_number} className="ai-day-card">
                    <h3>{d.day_name}</h3>
                    <ul>
                      <li>
                        <strong>Breakfast:</strong> {d.breakfast}
                      </li>
                      <li>
                        <strong>Lunch:</strong> {d.lunch}
                      </li>
                      <li>
                        <strong>Dinner:</strong> {d.dinner}
                      </li>
                      <li>
                        <strong>Snacks:</strong> {d.snacks}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Program button + links */}
            {programId && (
              <div className="ai-start-program-container">
                <button
                  type="button"
                  className="ai-start-program-button"
                  onClick={handleStartProgram}
                >
                  Start This Program
                </button>

                {startMessage && (
                  <div className="ai-start-program-links">
                    <span className="ai-start-program-note">
                      {startMessage}
                    </span>
                    <div className="ai-start-links-inline">
                      <Link to="/today-workout">Go to Today&apos;s Workout</Link>
                      <Link to="/today-meal">Go to Today&apos;s Meals</Link>
                      <Link to="/progress">View Progress Dashboard</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiWorkoutPlanner;
