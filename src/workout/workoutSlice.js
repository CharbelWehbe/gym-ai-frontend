import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateWorkoutPlan } from "./workoutApi";

const initialState = { loading: false, plan: null, error: null, source: null };

export const generateWorkout = createAsyncThunk(
  "workout/generate",
  async (payload) => await generateWorkoutPlan(payload)
);

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(generateWorkout.pending,  (s) => { s.loading = true; s.error = null; });
    b.addCase(generateWorkout.fulfilled, (s, a) => {
      s.loading = false;
      s.plan = a.payload.plan;
      s.source = a.payload.source;
      s.error = null;
    });
    b.addCase(generateWorkout.rejected, (s, a) => {
      s.loading = false;
      s.plan = null;
      s.error = a.error.message || "Failed";
    });
  }
});

export const workoutReducer = workoutSlice.reducer;
