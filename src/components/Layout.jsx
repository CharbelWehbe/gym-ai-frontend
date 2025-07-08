import Navbar from "./Navbar";
import Footer from "./Footer";
//import "../styles/layout.css";
import { Outlet } from "react-router-dom";
import '../App.css'

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}













// export default function Layout({ children }) {
//   return (
//     <div>
//       <Navbar />
//       <main className="main-content">{children}</main>
//       <Footer />
//     </div>
//   );
// }