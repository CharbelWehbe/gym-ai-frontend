import axios from "axios";

export const generateWorkoutPlan = async (payload) => {
  const { data } = await axios.post("/api/ai/workout-plan", payload, {
    headers: { "Content-Type": "application/json" }
  });
  return data; // { plan, text, usage, source }
};
