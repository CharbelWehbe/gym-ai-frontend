import Navbar from "./Navbar";
import Footer from "./Footer";
//import "../styles/layout.css";
import '../App.css'

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
