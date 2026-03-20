import React, { useEffect, useState } from "react";
import API from "../../api";
import "./ProgressDashboard.css";

const getBmiCategory = (bmi) => {
  const v = Number(bmi);
  if (!v || Number.isNaN(v)) return "";

  if (v < 18.5) return "Underweight (BMI < 18.5)";
  if (v < 25) return "Normal weight (18.5 – 24.9)";
  if (v < 30) return "Overweight (25 – 29.9)";
  if (v < 35) return "Obesity class I (30 – 34.9)";
  if (v < 40) return "Obesity class II (35 – 39.9)";
  return "Obesity class III (≥ 40)";
};

const ProgressDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    weight_kg: "",
    height_cm: "",
    goal: "",
  });

  // 1) Load history from backend (NOT localStorage anymore)
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/fitness-metrics");
        const list = res.data.metrics || [];
        setMetrics(list);

        const latest = list[list.length - 1];
        if (latest) {
          setForm((prev) => ({
            weight_kg:
              prev.weight_kg !== "" && prev.weight_kg != null
                ? prev.weight_kg
                : latest.weight_kg ?? "",
            height_cm:
              prev.height_cm !== "" && prev.height_cm != null
                ? prev.height_cm
                : latest.height_cm ?? "",
            goal:
              prev.goal !== "" && prev.goal != null
                ? prev.goal
                : latest.goal ?? "",
          }));
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            "Could not load your progress data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const latest = metrics.length ? metrics[metrics.length - 1] : null;

  const latestBmiValue = latest?.bmi ?? null;
  const bmiCategory = latestBmiValue != null
    ? getBmiCategory(latestBmiValue)
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 2) User finishes a block → add a new snapshot to BACKEND
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!latest) return; // nothing to base on

    setError("");

    const weight_kg = Number(form.weight_kg) || null;
    const height_cm =
      form.height_cm !== ""
        ? Number(form.height_cm)
        : latest.height_cm ?? null;
    const goal = form.goal || latest.goal || "";

    const payload = {
      program_id: latest.program_id ?? null,
      gender: latest.gender ?? null,
      age: latest.age ?? null,
      height_cm,
      weight_kg,
      goal,
    };

    try {
      const res = await API.post("/fitness-metrics", payload);
      const newMetric = res.data.metric;
      setMetrics((prev) => [...prev, newMetric]);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Could not save updated progress. Please try again."
      );
    }
  };

  /* ---- Build points for SVG graph (weight over time) ---- */
  const buildWeightPoints = () => {
    if (!metrics.length) return [];

    const weights = metrics
      .map((m) => Number(m.weight_kg))
      .filter((v) => !Number.isNaN(v) && v > 0);
    if (!weights.length) return [];

    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const span = maxW - minW || 1;

    const width = 600;
    const height = 220;
    const padding = 40;

    return metrics
      .map((m, i) => {
        const w = Number(m.weight_kg);
        if (!w) return null;

        const x =
          padding +
          (metrics.length === 1
            ? 0
            : (i / (metrics.length - 1)) * (width - 2 * padding));

        const normalized = (w - minW) / span;
        const y =
          height - padding - normalized * (height - 2 * padding);

        const labelDate =
          m.date ||
          (m.created_at
            ? new Date(m.created_at).toISOString().slice(0, 10)
            : "");

        return {
          x,
          y,
          date: labelDate,
          weight: w,
        };
      })
      .filter(Boolean);
  };

  const points = buildWeightPoints();
  const polylinePoints =
    points.length > 1
      ? points.map((p) => `${p.x},${p.y}`).join(" ")
      : "";

  const latestDate =
    latest &&
    (latest.date ||
      (latest.created_at
        ? new Date(latest.created_at).toISOString().slice(0, 10)
        : ""));

  return (
    <div className="progress-page">
      <div className="progress-container">
        <h1 className="progress-title">Progress Dashboard</h1>
        <p className="progress-subtitle">
          Your first snapshot is saved automatically when you click{" "}
          <b>&quot;Start This Program&quot;</b> in the AI Workout Planner.
          After finishing your plan (for example 7 days), come here to
          update your weight and goal.
        </p>

        {loading && (
          <p className="progress-status">Loading your data...</p>
        )}
        {error && <p className="progress-error">{error}</p>}

        {/* CURRENT SNAPSHOT */}
        <div className="metrics-cards">
          <div className="metrics-card">
            <h2>Current plan metrics</h2>
            {latest ? (
              <>
                <p>
                  <span className="metric-label">Date:</span>{" "}
                  {latestDate || "—"}
                </p>
                <p>
                  <span className="metric-label">Age:</span>{" "}
                  {latest.age != null ? `${latest.age} years` : "—"}
                </p>
                <p>
                  <span className="metric-label">Gender:</span>{" "}
                  {latest.gender || "—"}
                </p>
                <p>
                  <span className="metric-label">Weight:</span>{" "}
                  {latest.weight_kg ? `${latest.weight_kg} kg` : "—"}
                </p>
                <p>
                  <span className="metric-label">Height:</span>{" "}
                  {latest.height_cm ? `${latest.height_cm} cm` : "—"}
                </p>
                <p>
                  <span className="metric-label">Goal:</span>{" "}
                  {latest.goal || "—"}
                </p>
              </>
            ) : (
              <p>
                No data yet. Start a program in the AI Workout Planner to
                record your first metrics.
              </p>
            )}
          </div>

          <div className="metrics-card">
            <h2>BMI &amp; BMR</h2>
            {latest && (latest.bmi || latest.bmr) ? (
              <>
              <p>
  <span className="metric-label">BMI:</span>{" "}
  {latest.bmi ?? "—"}
</p>

{latestBmiValue && (
  <p>
    <span className="metric-label">BMI category:</span>{" "}
    {bmiCategory || "—"}
  </p>
)}

<p>
  <span className="metric-label">BMR:</span>{" "}
  {latest.bmr ? `${Math.round(latest.bmr)} kcal/day` : "—"}
</p>

{latest.bmi && (
  <p className="metric-note">
    BMI is just an indicator. Combine it with how you feel,
    your strength, and your progress photos.
  </p>
)}

              </>
            ) : (
              <p>
                Once you have weight &amp; height recorded, we&apos;ll
                calculate your BMI and BMR automatically.
              </p>
            )}
          </div>
        </div>

        {/* UPDATE FORM */}
        {latest && (
          <div className="progress-form-block">
            <h2>Update your progress</h2>
            <p className="progress-form-note">
              Example flow: follow your 7-day (or 4-week) plan, then come
              here and enter your <b>new weight</b> and <b>goal</b>.  
              This creates a new point in the history and updates the
              graph.
            </p>

            <form className="progress-form" onSubmit={handleAddEntry}>
              <div className="progress-form-row">
                <div className="progress-form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight_kg"
                    value={form.weight_kg}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="progress-form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height_cm"
                    value={form.height_cm}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="progress-form-group full-width">
                <label>Goal</label>
                <input
                  type="text"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  placeholder="Keep losing fat, gain muscle, maintain..."
                />
              </div>

              <button type="submit" className="progress-save-btn">
                Save progress point
              </button>
            </form>
          </div>
        )}

        {/* WEIGHT GRAPH */}
        <div className="progress-graph-block">
          <h2>Weight progress</h2>
          {points.length ? (
            <div className="progress-graph-wrapper">
              <svg
                viewBox="0 0 600 220"
                className="progress-graph-svg"
              >
                {/* Axes */}
                <line
                  x1="40"
                  y1="10"
                  x2="40"
                  y2="180"
                  className="graph-axis"
                />
                <line
                  x1="40"
                  y1="180"
                  x2="580"
                  y2="180"
                  className="graph-axis"
                />

                {/* Line */}
                {polylinePoints && (
                  <polyline
                    points={polylinePoints}
                    className="graph-line"
                    fill="none"
                  />
                )}

                {/* Points */}
                {points.map((p) => (
                  <circle
                    key={`${p.date}-${p.weight}-${p.x}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="graph-point"
                  />
                ))}
              </svg>
              <p className="graph-caption">
                Each point is one snapshot (start of a plan or an update after
                finishing a plan).
              </p>
            </div>
          ) : (
            <p>
              No data yet. Start your first program in the AI Workout
              Planner, then come back here to see your progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
