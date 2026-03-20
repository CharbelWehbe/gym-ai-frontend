import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api";
import "./TodayWorkout.css";

const REST_CIRCLE_RADIUS = 70;
const REST_CIRCLE_CIRCUMFERENCE = 2 * Math.PI * REST_CIRCLE_RADIUS;
// local audio tracks for rest music (files in public/audio)
const audioTracks = [
  { src: "/audio/1.mp3", label: "Rest Track 1" },
  { src: "/audio/2.mp3", label: "Rest Track 2" },
  { src: "/audio/3.mp3", label: "Rest Track 3" },
  { src: "/audio/4.mp3", label: "Rest Track 4" },
  { src: "/audio/5.mp3", label: "Rest Track 5" },
];
// turn exercise names into codes used in QR (e.g. "Leg Press" -> "leg-press")
const slugify = (name = "") =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove things in parentheses
    .replace(/[^a-z0-9]+/g, "-") // spaces & special chars -> "-"
    .replace(/^-+|-+$/g, ""); // trim extra "-"

const TodayWorkout = () => {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal + tracking state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);
  const [setInputs, setSetInputs] = useState([]);
  const [exerciseElapsed, setExerciseElapsed] = useState(0);
  const [exerciseTimerRunning, setExerciseTimerRunning] = useState(false);

  // Rest timer inside modal
  const [restSeconds, setRestSeconds] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [restTotal, setRestTotal] = useState(0);       // NEW
  const [showRestPopup, setShowRestPopup] = useState(false); // NEW

  // Completed + summary
  const [completedExercises, setCompletedExercises] = useState({}); // { [exerciseId]: true }
  const [exercisesSummary, setExercisesSummary] = useState({}); // { [exerciseId]: summary }

  // Lock state after workout completed
  const [dayLocked, setDayLocked] = useState(false);
  const [completedLogDate, setCompletedLogDate] = useState("");

  // Tutorial popup state
  const [showTutorial, setShowTutorial] = useState(false);

  // Music player state for rest popup
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const audioRef = useRef(null);

  const restProgress =
  restTotal > 0 ? restSeconds / restTotal : 0; // 1 -> 0
const restDashOffset =
  REST_CIRCLE_CIRCUMFERENCE * (1 - restProgress);

  const navigate = useNavigate();
  const location = useLocation();
  const autoOpenRef = useRef(null); // to avoid auto-open loops

  // 🔁 Helper to load today's workout + existing log
  const reloadToday = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.get("/workout-programs/active/today");
      const todayData = res.data.today || null;
      setToday(todayData);

      // reset local state for a fresh day
      setCompletedExercises({});
      setExercisesSummary({});
      setDayLocked(false);
      setCompletedLogDate("");

      if (todayData) {
        try {
          const logRes = await API.get(
            `/workout-programs/${todayData.program_id}/days/${todayData.day_number}/log`
          );
          const log = logRes.data.log;

          if (log) {
            const exSummaries = log.exercises_summary || [];
            const summaryMap = {};
            const completedMap = {};

            exSummaries.forEach((ex) => {
              if (ex.exercise_id) {
                summaryMap[ex.exercise_id] = ex;
                completedMap[ex.exercise_id] = true;
              }
            });

            setExercisesSummary(summaryMap);
            setCompletedExercises(completedMap);

            if (log.is_completed) {
              setDayLocked(true);
              setCompletedLogDate(log.date);
            }
          }
        } catch (logErr) {
          console.error("Error fetching existing log:", logErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Could not load today's workout."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's workout on mount
  useEffect(() => {
    reloadToday();
  }, []);

  // Overall exercise timer (time spent on current exercise)
  useEffect(() => {
    if (!modalOpen || !exerciseTimerRunning) return;

    const interval = setInterval(() => {
      setExerciseElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [modalOpen, exerciseTimerRunning]);

  // Rest timer inside modal
  useEffect(() => {
    if (!restRunning || restSeconds <= 0) return;

    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRestRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restRunning, restSeconds]);

  // ✅ Start/edit exercise (wrapped in useCallback for stable reference)
const handleStartExercise = useCallback(
  (exercise) => {
    if (dayLocked) return; // no changes allowed

    setError("");
    setSuccess("");
    setShowTutorial(false);

    setActiveExercise(exercise);

    // figure out current program/day for localStorage key
    const currentProgramId = today?.program_id;
    const currentDayNumber = today?.day_number;

    let existingSummary = exercisesSummary[exercise.id];

    // if not in state yet, try loading from localStorage
    if (!existingSummary && currentProgramId && currentDayNumber) {
      const storageKey = `workout_sets_${currentProgramId}_${currentDayNumber}_${exercise.id}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          existingSummary = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Could not parse stored sets for exercise", e);
      }
    }

    if (existingSummary) {
      // Prefill from previous data when editing
      const existingSets =
        existingSummary.sets && existingSummary.sets.length
          ? existingSummary.sets
          : Array.from(
              { length: exercise.sets || 3 },
              (_, idx) => ({
                setNumber: idx + 1,
                weight: "",
                reps: "",
              })
            );

      const normalizedSets = existingSets.map((s, idx) => ({
        setNumber: s.setNumber || idx + 1,
        weight: s.weight ?? "",
        reps: s.reps ?? "",
      }));

      setSetInputs(normalizedSets);
      setExerciseElapsed(existingSummary.total_time_seconds || 0);
    } else {
      // First time starting this exercise
      const setsPlanned = exercise.sets || 3;
      const initialInputs = Array.from(
        { length: setsPlanned },
        (_, idx) => ({
          setNumber: idx + 1,
          weight: "",
          reps: "",
        })
      );
      setSetInputs(initialInputs);
      setExerciseElapsed(0);
    }

    setExerciseTimerRunning(true);
    setRestSeconds(exercise.rest_seconds || 90);
    setRestRunning(false);
    setModalOpen(true);
  },
  [dayLocked, exercisesSummary, today] // ⬅️ note: added `today` here
);

  // 🔹 When we come from ScanPage with ?machineCode=XYZ, auto-open that exercise
  useEffect(() => {
    if (!today || !today.exercises || !today.exercises.length) return;

    const params = new URLSearchParams(location.search);
    const machineCode = params.get("machineCode");

    if (!machineCode) return;

    // avoid reopening if already opened for this machineCode
    if (autoOpenRef.current === machineCode) return;
    autoOpenRef.current = machineCode;

    // find exercise whose slug matches QR code
    const match = today.exercises.find(
      (e) => slugify(e.exercise_name) === machineCode
    );

    if (match && !dayLocked) {
      handleStartExercise(match);
    } else if (!match) {
      setError("This machine is not in today's workout.");
    }
  }, [today, location.search, dayLocked, handleStartExercise]);

  const closeModal = () => {
    setModalOpen(false);
    setActiveExercise(null);
    setExerciseTimerRunning(false);
    setExerciseElapsed(0);
    setRestRunning(false);
    setRestSeconds(0);
      setRestTotal(0);         // NEW

    setSetInputs([]);
    setShowTutorial(false);
        setShowRestPopup(false); // NEW
// 🔇 stop music when closing modal
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
    setCurrentTrackIndex(null);
  };

  const handleSetInputChange = (index, field, value) => {
    setSetInputs((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  };

  const startRestTimer = () => {
    if (!activeExercise) return;
    const seconds = activeExercise.rest_seconds || 90;

      setRestTotal(seconds);       // total duration
    setRestSeconds(seconds);
    setRestRunning(true);
        setShowRestPopup(true); // open the circular popup

  };


  const handlePlayRandomTrack = () => {
  if (!audioRef.current) return;

  // 👉 If we already have a paused track with some progress: RESUME
  if (
    currentTrackIndex !== null &&
    audioRef.current.src &&
    audioRef.current.currentTime > 0 &&
    audioRef.current.paused &&
    !audioRef.current.ended
  ) {
    audioRef.current
      .play()
      .then(() => {
        setIsMusicPlaying(true);
      })
      .catch((err) => {
        console.error("Could not resume audio", err);
      });
    return;
  }

  // Otherwise: pick a NEW random track
  let randomIndex = Math.floor(Math.random() * audioTracks.length);
  if (audioTracks.length > 1 && randomIndex === currentTrackIndex) {
    randomIndex = (randomIndex + 1) % audioTracks.length;
  }

  setCurrentTrackIndex(randomIndex);
  const track = audioTracks[randomIndex];

  audioRef.current.src = track.src;
  audioRef.current
    .play()
    .then(() => {
      setIsMusicPlaying(true);
    })
    .catch((err) => {
      console.error("Could not play audio", err);
    });
};



  const handlePauseMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsMusicPlaying(false);
  };

// ✅ Save exercise summary + sync partial log to backend
const handleExerciseDone = async () => {
  if (!activeExercise) return;

  const setsPlanned = activeExercise.sets || setInputs.length || 3;
  const setsCompleted = setInputs.filter(
    (s) => s.reps && s.reps.trim() !== ""
  ).length;

  const summary = {
    exercise_id: activeExercise.id,
    exercise_name: activeExercise.exercise_name,
    sets_planned: setsPlanned,
    sets_completed: setsCompleted,
    rest_seconds: activeExercise.rest_seconds || null,
    total_time_seconds: exerciseElapsed,
    sets: setInputs,
  };

  // Update local state maps
  const updatedSummaryMap = {
    ...exercisesSummary,
    [activeExercise.id]: summary,
  };

  setExercisesSummary(updatedSummaryMap);
  setCompletedExercises((prev) => ({
    ...prev,
    [activeExercise.id]: true,
  }));

  // 🔐 Persist this exercise to localStorage so re-scan keeps reps/weight
  if (today && today.program_id && today.day_number) {
    const storageKey = `workout_sets_${today.program_id}_${today.day_number}_${activeExercise.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(summary));
    } catch (e) {
      console.error("Could not save exercise sets in localStorage", e);
    }
  }

  // 🔄 Save partial log (is_completed = false) so progress persists on backend
  if (today && today.program_id && today.day_number) {
    try {
      await API.post(
        `/workout-programs/${today.program_id}/days/${today.day_number}/log`,
        {
          is_completed: false,
          exercises_summary: Object.values(updatedSummaryMap),
        }
      );
    } catch (err) {
      console.error("Could not save partial log", err);
    }
  }

  closeModal();
};


  // ✅ Mark day as completed (and lock it)
  const handleMarkCompleted = async () => {
    if (!today || !today.program_id || !today.day_number) return;
    if (dayLocked) return; // already completed

    setError("");
    setSuccess("");

    try {
      const payload = {
        is_completed: true,
        exercises_summary: Object.values(exercisesSummary),
      };

      await API.post(
        `/workout-programs/${today.program_id}/days/${today.day_number}/log`,
        payload
      );

      // Mark day locked locally
      setDayLocked(true);
      const todayStr = new Date().toISOString().slice(0, 10);
      setCompletedLogDate(todayStr);

      // Go to summary page
      navigate(
        `/workout-summary/${today.program_id}/${today.day_number}`
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Could not log today's workout. Please try again."
      );
    }
  };

  // ✅ Go to next day workout (uses backend /next-day)
  const handleGoToNextDay = async () => {
    if (!today || !today.program_id) return;
    setError("");
    setSuccess("");

    try {
      await API.post(`/workout-programs/${today.program_id}/next-day`);
      await reloadToday();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Could not move to next day. Please try again."
      );
    }
  };

  // ✅ Skip this day and move to next (uses backend /skip-day)
  const handleSkipDay = async () => {
    if (!today || !today.program_id) return;
    setError("");
    setSuccess("");

    try {
      await API.post(`/workout-programs/${today.program_id}/skip-day`);
      await reloadToday();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Could not skip this day. Please try again."
      );
    }
  };

  const formatSeconds = (sec) => {
    const s = sec || 0;
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  if (loading) {
    return <div className="today-container">Loading...</div>;
  }

  if (error && !today) {
    return <div className="today-container error">{error}</div>;
  }

  if (!today) {
    return (
      <div className="today-container">
        <p>No active program or program is completed.</p>
        <p>Go to AI Planner to generate and start a new program.</p>
        <button
          type="button"
          className="today-ai-plan-btn"
          onClick={() => navigate("/ai-workout-plan")}
        >
          Open AI Workout Planner
        </button>
      </div>
    );
  }

  return (
    <div className="today-container">
      <h1>Today&apos;s Workout</h1>
      <h2>
        {today.day_name} (Day {today.day_number})
      </h2>

      {/* 🔹 Always-visible actions: summary + history */}
      <div className="today-global-actions">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/workout-summary/${today.program_id}/${today.day_number}`
            )
          }
        >
          View today summary
        </button>
        <button type="button" onClick={() => navigate("/workout-history")}>
          View full history
        </button>
      </div>

      {/* Banner when day is locked (completed) */}
      {dayLocked && (
        <div className="today-info-banner">
          <div>
            Workout completed on {completedLogDate}. This day is locked.
          </div>
          <div className="today-info-actions">
            <button type="button" onClick={handleGoToNextDay}>
              Next day workout
            </button>
          </div>
        </div>
      )}

      {error && <div className="today-error">{error}</div>}
      {success && <div className="today-success">{success}</div>}

      {today.is_rest_day ? (
        <>
          <h3>Rest / Active-Recovery Day</h3>

          {today.notes ? (
            <p>{today.notes}</p>
          ) : (
            <p>
              This is a rest / active-recovery day. Focus on mobility, walking,
              and good sleep.
            </p>
          )}

          {!dayLocked && (
            <div className="today-rest-actions">
              <button type="button" onClick={handleSkipDay}>
                Skip this rest day and show next
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* 🔹 ONE global scan button instead of per-exercise start buttons */}
          {!dayLocked && (
            <div className="today-scan-row">
              <button
                type="button"
                className="today-scan-btn"
                onClick={() => navigate("/scan")}
              >
                Scan machine to start exercise
              </button>
            </div>
          )}

          {/* Skip button for not-completed WORKOUT day */}
          {!dayLocked && (
            <div className="today-skip-row">
              <button type="button" onClick={handleSkipDay}>
                Skip this day and show next
              </button>
            </div>
          )}

          <ul className="today-exercise-list">
            {today.exercises?.map((ex) => {
              const done = !!completedExercises[ex.id];
              const summary = exercisesSummary[ex.id];

              return (
                <li
                  key={ex.id}
                  className={`today-exercise-item ${
                    done ? "exercise-done" : ""
                  }`}
                >
                  <div className="exercise-header">
                    <div>
                      <strong>{ex.exercise_name}</strong>
                      {ex.muscle_group && ` (${ex.muscle_group})`}
                    </div>
                    {done && <span className="exercise-tick">✓</span>}
                  </div>
                  <div>
                    {ex.sets && `${ex.sets} sets`}{" "}
                    {ex.reps && `× ${ex.reps}`}
                  </div>
                  {ex.rest_seconds && (
                    <div>Suggested rest: {ex.rest_seconds} seconds</div>
                  )}

                  {summary && (
                    <div className="exercise-mini-summary">
                      Time spent:{" "}
                      {formatSeconds(summary.total_time_seconds || 0)} ·
                      Sets completed: {summary.sets_completed}/
                      {summary.sets_planned}
                    </div>
                  )}

                  {/* no per-exercise button; scan triggers it */}
                </li>
              );
            })}
          </ul>

          <div className="complete-day-block">
            {dayLocked ? (
              <button
                type="button"
                className="completed-day-btn"
                disabled
              >
                Workout already completed on {completedLogDate}
              </button>
            ) : (
              <button type="button" onClick={handleMarkCompleted}>
                Mark Today as Completed
              </button>
            )}
          </div>
        </>
      )}

      {/* MODAL */}
      {modalOpen && activeExercise && (
        <div className="exercise-modal-overlay">
          <div className="exercise-modal">
            <div className="exercise-modal-header">
              <h3>{activeExercise.exercise_name}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
                         {/* Rest timer popup with shrinking circular progress */}
{showRestPopup && (
  <div className="rest-popup-overlay">
    <div className="rest-popup">
      <p className="rest-total-label">
        {restTotal || activeExercise.rest_seconds || 90}s total
      </p>

      <div className="rest-circle">
        <svg
          className="rest-svg"
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          {/* grey full circle */}
          <circle
            className="rest-circle-bg"
            cx="90"
            cy="90"
            r={REST_CIRCLE_RADIUS}
          />
          {/* colored shrinking arc */}
          <circle
            className="rest-circle-progress"
            cx="90"
            cy="90"
            r={REST_CIRCLE_RADIUS}
            style={{
              strokeDasharray: REST_CIRCLE_CIRCUMFERENCE,
              strokeDashoffset: restDashOffset,
            }}
          />
        </svg>

        <span className="rest-circle-number">
          {restSeconds}
        </span>
      </div>

      <p className="rest-popup-label">
        {restRunning
          ? "Resting... breathe and relax"
          : restSeconds === 0
          ? "Rest finished! Ready for the next set?"
          : "Rest paused"}
      </p>
 {/* 🎵 Music while resting */}
      <div className="rest-music-block">
        <p className="rest-music-title">
          {currentTrackIndex !== null
            ? `Now playing: ${audioTracks[currentTrackIndex].label}`
            : "Want some music while you rest?"}
        </p>

        <div className="rest-music-actions">
          <button
            type="button"
            className="rest-music-btn"
            onClick={handlePlayRandomTrack}
          >

 {isMusicPlaying
    ? "Play another track"
    : currentTrackIndex !== null
    ? "Resume"
    : "Play random track"}
            {/* {isMusicPlaying ? "Play another track" : "Play random track"} */}
          </button>

          {isMusicPlaying && (
            <button
              type="button"
              className="rest-music-pause-btn"
              onClick={handlePauseMusic}
            >
              Pause
            </button>
          )}
        </div>

        {/* hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => {
            setIsMusicPlaying(false);
          }}
        />
      </div>

      <button
        type="button"
        className="rest-popup-close"
        onClick={() => {
          setShowRestPopup(false);
          setRestRunning(false);
          setRestSeconds(0);
          setRestTotal(0);
         // 🔇 stop music when closing just the rest popup
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
    setCurrentTrackIndex(null);
  }}
      >
        Close
      </button>
    </div>
  </div>
)}

            </div>

            <p>
              Sets: {activeExercise.sets || setInputs.length} · Reps:{" "}
              {activeExercise.reps || "as listed"}{" "}
              {activeExercise.rest_seconds &&
                `· Rest: ${activeExercise.rest_seconds}s`}
            </p>

            <p className="exercise-time">
              Time on this exercise: {formatSeconds(exerciseElapsed)}
            </p>

            {/* Tutorial button (uses activeExercise.tutorial_url if backend sends it) */}
            {activeExercise.tutorial_url && (
              <div className="exercise-tutorial-block">
                <button
                  type="button"
                  className="tutorial-btn"
                  onClick={() => setShowTutorial(true)}
                >
                  Watch tutorial
                </button>
              </div>
            )}

            <div className="sets-table">
              {setInputs.map((s, index) => (
                <div key={s.setNumber} className="set-row">
                  <span>Set {s.setNumber}</span>
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={s.weight}
                    onChange={(e) =>
                      handleSetInputChange(
                        index,
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={s.reps}
                    onChange={(e) =>
                      handleSetInputChange(
                        index,
                        "reps",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>

          <div className="rest-timer-block">
  <h4>Rest timer</h4>
  <button
    type="button"
    className="rest-open-btn"
    onClick={startRestTimer}
    disabled={restRunning && showRestPopup}
  >
    {restRunning ? "Resting..." : "Start rest"}
  </button>
  <span className="rest-hint">
    {(activeExercise.rest_seconds || 90)}s suggested rest
  </span>
</div>

            <div className="modal-actions">
              <button
                type="button"
                className="exercise-done-btn"
                onClick={handleExerciseDone}
              >
                Done with this exercise
              </button>
            </div>

            {/* Tutorial popup overlay */}
            {showTutorial && activeExercise.tutorial_url && (
              <div className="tutorial-modal-overlay">
                <div className="tutorial-modal">
                  <button
                    type="button"
                    className="tutorial-close-btn"
                    onClick={() => setShowTutorial(false)}
                  >
                    ×
                  </button>
                  <div className="tutorial-video-wrapper">
                    <iframe
                      src={activeExercise.tutorial_url}
                      title="Exercise Tutorial"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayWorkout;

