import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/Landingpage";
import Profile from "./pages/profile/Profile";
import Signin from "./pages/signin/Signin";
import Layout from "./components/Layout";
import ScrollToTop from "./pages/ScrollToTop";
import ScanPage from "./pages/scanpage/ScanPage";
import MachinePages from "./pages/machinepages/MachinePages";
import AiWorkoutPlanner from "./pages/AiWorkoutPlan/AiWorkoutPlanner";
import TodayWorkout from "./pages/TodayWorkout/TodayWorkout";
import WorkoutSummary from "./pages/WorkoutSummary/WorkoutSummary";
import WorkoutHistory from "./pages/WorkoutHistory/WorkoutHistory";
import TodayMeal from "./pages/TodayMeal/TodayMeal";
import Signup from "./pages/signup/SignupPage";
import ProgressDashboard from "./pages/Progress/ProgressDashboard";

// 🔐 Small auth guard
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/scan" element={<RequireAuth><ScanPage /></RequireAuth>} />
          <Route path="/machines/:id" element={<RequireAuth><MachinePages /></RequireAuth>} />

          <Route
            path="/ai-workout-plan"
            element={
              <RequireAuth>
                <AiWorkoutPlanner />
              </RequireAuth>
            }
          />
          <Route
            path="/today-workout"
            element={
              <RequireAuth>
                <TodayWorkout />
              </RequireAuth>
            }
          />
          
          <Route path="/today-meal" element={<TodayMeal />} />

          <Route
          path="/workout-summary/:programId/:dayNumber"
          element={
            <RequireAuth>
              <WorkoutSummary />
            </RequireAuth>
          }
         />
          <Route
          path="/workout-history"
          element={
            <RequireAuth>
              <WorkoutHistory />
            </RequireAuth>
          }
          />
          <Route
  path="/progress"
  element={
    <RequireAuth>
      <ProgressDashboard />
    </RequireAuth>
  }
/>

</Route>

<Route
  path="/signup"
  element={
    localStorage.getItem("token") ? <Navigate to="/profile" /> : <Signup />
  }
/>
          <Route
          path="/login"
          element={
            localStorage.getItem("token") ? <Navigate to="/profile" /> : <Signin />
          }
          />

            </Routes>
    </>
  );
}

export default App;
