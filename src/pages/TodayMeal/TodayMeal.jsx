import React, { useEffect, useState } from "react";
import API from "../../api";
import "./TodayMeal.css";
import { useNavigate } from "react-router-dom"; // ⬅️ add this

const TodayMeal = () => {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [todayMeals, setTodayMeals] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false); // full day done

  // per-meal done state
  const [mealDone, setMealDone] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });
  const navigate = useNavigate(); // ⬅️ add this

  // helper to build a stable key for full-day done
  const buildStorageKey = (programId, dayNumber) => {
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return `diet_done_${programId}_${dayNumber}_${todayStr}`;
  };

  // helper for per-meal keys
  const buildMealStorageKey = (programId, dayNumber, mealName) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return `diet_meal_${programId}_${dayNumber}_${mealName}_${todayStr}`;
  };

  useEffect(() => {
    const fetchTodayMeals = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) get active program (includes diet_plan + current_day_number)
        const res = await API.get("/workout-programs/active");
        const prog = res.data.program || null;

        if (!prog || !prog.diet_plan) {
          setProgram(null);
          setTodayMeals(null);
          setLoading(false);
          return;
        }

        setProgram(prog);

        // 2) find today's day number
        const currentDayNumber = prog.current_day_number || 1;

        // 3) extract diet days
        const diet = prog.diet_plan;
        const days = Array.isArray(diet) ? diet : diet.days || [];

        // 4) find the entry for that day
        let today = days.find((d) => d.day_number === currentDayNumber);
        if (!today && days.length >= currentDayNumber) {
          // fallback: maybe array is indexed [0..6]
          today = days[currentDayNumber - 1];
        }

        setTodayMeals(today || null);

        // 5) load "full day done" state from localStorage
        const fullKey = buildStorageKey(prog.id, currentDayNumber);
        const storedFull = localStorage.getItem(fullKey);
        const isDayDone = storedFull === "true";
        setDone(isDayDone);

        // 6) load per-meal done state
        const meals = ["breakfast", "lunch", "dinner", "snacks"];
        const loadedMealDone = {
          breakfast: false,
          lunch: false,
          dinner: false,
          snacks: false,
        };

        meals.forEach((mealName) => {
          const mealKey = buildMealStorageKey(
            prog.id,
            currentDayNumber,
            mealName
          );
          const storedMeal = localStorage.getItem(mealKey);
          // if whole day was marked done, treat all meals as done too
          loadedMealDone[mealName] =
            storedMeal === "true" || isDayDone;
        });

        setMealDone(loadedMealDone);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
            "Could not load today's meal plan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTodayMeals();
  }, []);

  // ✅ toggle a single meal; no locking on the checkbox
  const handleMealCheck = (mealName) => {
    if (!program || !todayMeals) return;

    const currentDayNumber =
      program.current_day_number || todayMeals.day_number || 1;

    const newValue = !mealDone[mealName];

    const newMealDone = {
      ...mealDone,
      [mealName]: newValue,
    };

    setMealDone(newMealDone);

    const mealKey = buildMealStorageKey(
      program.id,
      currentDayNumber,
      mealName
    );

    if (newValue) {
      localStorage.setItem(mealKey, "true");
    } else {
      // allow unchecking: remove from storage
      localStorage.removeItem(mealKey);
    }

    // Auto-mark full day done ONLY if:
    // - we are not already in "done" state
    // - and now all meals are checked
    if (!done) {
      const allDone =
        newMealDone.breakfast &&
        newMealDone.lunch &&
        newMealDone.dinner &&
        newMealDone.snacks;

      if (allDone) {
        const fullKey = buildStorageKey(program.id, currentDayNumber);
        setDone(true);
        localStorage.setItem(fullKey, "true");
      }
    }


  };

  // ✅ one-way: mark ALL meals + day as done; can't undo the "day done" state
  const handleMarkAllDone = () => {
    if (!program || !todayMeals) return;
    if (done) return; // already done → no toggle back

    const currentDayNumber =
      program.current_day_number || todayMeals.day_number || 1;

    setDone(true);
    const fullKey = buildStorageKey(program.id, currentDayNumber);
    localStorage.setItem(fullKey, "true");

    const updatedMeals = {
      breakfast: true,
      lunch: true,
      dinner: true,
      snacks: true,
    };
    setMealDone(updatedMeals);

    ["breakfast", "lunch", "dinner", "snacks"].forEach((mealName) => {
      const mealKey = buildMealStorageKey(
        program.id,
        currentDayNumber,
        mealName
      );
      localStorage.setItem(mealKey, "true");
    });
  };
  if (loading) {
    return <div className="today-meal-container">Loading...</div>;
  }

  if (error) {
    return <div className="today-meal-container error">{error}</div>;
  }

  if (!program || !todayMeals) {
    return (
      <div className="today-meal-container today-meal-empty">
        <p className="today-meal-empty-title">No diet plan found.</p>
        <p className="today-meal-empty-subtitle">
          Go to the AI Planner to generate a workout plan.
        </p>
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

  const { label, breakfast, lunch, dinner, snacks } = todayMeals;

  return (
    <div className="today-meal-container">
      <h1>Today's Meals</h1>
      <h2>
        {label ||
          `Day ${
            todayMeals.day_number || program.current_day_number
          }`}
      </h2>

      <div className="today-meal-card">
        <div className="today-meal-row">
          <label className="today-meal-label">
            <input
              type="checkbox"
              className="today-meal-checkbox"
              checked={mealDone.breakfast}
              onChange={() => handleMealCheck("breakfast")}
            />
            <strong>Breakfast</strong>
          </label>
          <p>{breakfast || "No breakfast data for today."}</p>
        </div>

        <div className="today-meal-row">
          <label className="today-meal-label">
            <input
              type="checkbox"
              className="today-meal-checkbox"
              checked={mealDone.lunch}
              onChange={() => handleMealCheck("lunch")}
            />
            <strong>Lunch</strong>
          </label>
          <p>{lunch || "No lunch data for today."}</p>
        </div>

        <div className="today-meal-row">
          <label className="today-meal-label">
            <input
              type="checkbox"
              className="today-meal-checkbox"
              checked={mealDone.dinner}
              onChange={() => handleMealCheck("dinner")}
            />
            <strong>Dinner</strong>
          </label>
          <p>{dinner || "No dinner data for today."}</p>
        </div>

        <div className="today-meal-row">
          <label className="today-meal-label">
            <input
              type="checkbox"
              className="today-meal-checkbox"
              checked={mealDone.snacks}
              onChange={() => handleMealCheck("snacks")}
            />
            <strong>Snacks</strong>
          </label>
          <p>{snacks || "No snacks data for today."}</p>
        </div>
      </div>

      <div className="today-meal-actions">
        <button
          type="button"
          className={done ? "meal-done-btn done" : "meal-done-btn"}
          onClick={handleMarkAllDone}
          disabled={done} // still one-way for the *day* state
        >
          {done ? "Meals done for today ✓" : "Mark today's meals as done"}
        </button>
      </div>
    </div>
  );
};

export default TodayMeal;
