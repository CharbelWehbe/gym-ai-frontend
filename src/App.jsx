// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import Categories from "./pages/categories/Categories";
import Profile from "./pages/profile/Profile";
import Signin from "./pages/signin/Signin";
import Layout from "./components/Layout";
import SpecificCategory from "./pages/specificcategory/SpecificCategory";
import ScrollToTop from "./pages/ScrollToTop";
import SorryPage from "./pages/sorrypage/SorryPage";
import Favorites from "./pages/favorites/Favorites";
import VideoPage from "./pages/videopage/VideoPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<SpecificCategory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/videopage/:videoId" element={<VideoPage />} />
        </Route>

        {/* Route without Layout */}
        <Route path="/login" element={<Signin />} />
        <Route path="/sorrypage" element={<SorryPage />} />
      </Routes>
    </>
  );
}





export default App;