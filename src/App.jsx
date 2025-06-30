// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route index element={<LandingPage/>}/> */}
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:categoryId" element={<Categories />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Signin />} />
    </Routes>
    </Layout>
  );
}

export default App;
