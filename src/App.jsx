// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Layout from "./components/Layout";
import SpecificCategory from "./pages/SpecificCategory";
import ScrollToTop from "./pages/ScrollToTop";
import SorryPage from "./pages/SorryPage";
import Favorites from "./pages/Favorites";


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
          <Route path="/favorites" element={<Favorites/>}/>
        </Route>

        {/* Route without Layout */}
        <Route path="/login" element={<Signin />} />
        <Route path="/sorrypage" element={<SorryPage />}/>
      </Routes>
    </>
  );
}












export default App;











// function App() {
//   return (
//     <Layout>
//       <ScrollToTop/>
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       {/* <Route index element={<LandingPage/>}/> */}
//       <Route path="/categories" element={<Categories />} />
//       <Route path="/categories/:categoryId" element={<SpecificCategory />} />
//       <Route path="/profile" element={<Profile />} />
//       <Route path="/login" element={<Signin />} />
//     </Routes>
//     </Layout>
    
//   );
// }


