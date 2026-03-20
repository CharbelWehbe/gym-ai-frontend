// import { configureStore } from "@reduxjs/toolkit";
// import { workoutReducer } from "./workout/workoutSlice"; // path matches files above

// export const store = configureStore({
//   reducer: { workout: workoutReducer },
// });
import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "../workout/workoutSlice";

export const store = configureStore({
  reducer: { workout: workoutReducer },
});
