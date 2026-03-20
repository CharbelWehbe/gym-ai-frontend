import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import API from "../../api";
import { Line } from "react-chartjs-2";

import "./MachinePage.css";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

export default function MachinePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [machine, setMachine] = useState(null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ weight: "", reps: "", sets: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate(`/login?next=/machines/${id}`);
  }, [id, navigate]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const m = await API.get(`/public/machines/${id}`);
        setMachine(m.data);

        const [h, s] = await Promise.all([
          API.get(`/machines/${id}/workouts`),
          API.get(`/machines/${id}/workouts/summary`),
        ]);

        setHistory(h.data || []);
        setSummary(s.data || null);

      } catch (error) {
        console.error(error);
        setMsg("Failed to load machine data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      await API.post(`/machines/${id}/workouts`, {
        weight: Number(form.weight),
        reps: Number(form.reps),
        sets: Number(form.sets || 1),
      });

      const [h, s] = await Promise.all([
        API.get(`/machines/${id}/workouts`),
        API.get(`/machines/${id}/workouts/summary`),
      ]);

      setHistory(h.data);
      setSummary(s.data);
      setMsg("Saved successfully! 💪");
    } catch {
      setMsg("Could not save workout.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    if (!history.length) return null;

    return {
      labels: history.map((r) =>
        new Date(r.created_at).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Weight (kg)",
          data: history.map((r) => r.weight),
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    };
  }, [history]);

  if (loading) {
    return (
      <div className="machine-loader">
        <ClipLoader color="#f97316" size={48} />
      </div>
    );
  }

  if (!machine) return null;

  const last = summary?.last;
  const recommended = summary?.recommended_weight ?? 20;

  return (
    <div className="machine-page no-inherit">
      <div className="machine-container">
        {/* HEADER */}
        <div className="machine-header">
          <h2>{machine.name}</h2>
          {machine.qr_code_path && (
            <a
              href={machine.qr_code_path}
              target="_blank"
              rel="noreferrer"
            >
              {/* View QR */}
            </a>
          )}
        </div>

        {machine.image_url && (
          <img className="machine-image" src={machine.image_url} alt="" />
        )}

        {/* TWO-COLUMN GRID */}
        <div className="machine-grid">
          {/* LEFT */}
          <div className="machine-section">
            <h3>Last Session</h3>
            {last ? (
              <p className="info-text">
                {last.weight}kg × {last.reps} reps
                {" — "}
                {new Date(last.created_at).toLocaleDateString()}
              </p>
            ) : (
              <p className="muted">No session history yet.</p>
            )}

            {/* <h3>AI Recommendation</h3> */}
            <p className="info-text">
              Suggested Weight: <b>{recommended} kg</b>
            </p>

            {machine.tutorial_url ? (
              <video controls className="tutorial-video">
                <source src={machine.tutorial_url} />
              </video>
            ) : (
              <p className="muted">Tutorial video coming soon.</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="machine-section form-section">
            <h3>Log Your Workout</h3>

            <form onSubmit={submit} className="machine-form">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                required
              />

              <label>Reps</label>
              <input
                type="number"
                value={form.reps}
                onChange={(e) => setForm({ ...form, reps: e.target.value })}
                required
              />

              <label>Sets</label>
              <input
                type="number"
                value={form.sets}
                onChange={(e) => setForm({ ...form, sets: e.target.value })}
              />

              <button disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </form>

            {msg && <div className="machine-toast">{msg}</div>}
          </div>
        </div>

        {/* CHART */}
        <div className="machine-chart-wrapper">
          <h3>Progress </h3>
          {chartData ? (
            <Line data={chartData} />
          ) : (
            <p className="muted">No workout data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}































