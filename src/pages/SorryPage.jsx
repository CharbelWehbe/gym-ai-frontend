    import '../SorryPage.css';
    import { useState } from 'react';
    import { FaArrowLeft } from "react-icons/fa";
    import { useNavigate } from "react-router-dom";
    import { Link } from "react-router-dom";

    export default function Signin() {
      const [showTerms, setShowTerms] = useState(false);
      
      const toggleTerms = () => setShowTerms(!showTerms);
      
      const navigate = useNavigate();
    
      return (
          <div className="body-image-sorrypage">
              <FaArrowLeft className="back-arrow-sorrypage" onClick={() => navigate("/")} />
    <Link to="/">
              <img src="/logo-image.png" alt="Logo" className="sorrypage-logo" />
    </Link>
          <img src="/body-image.png" alt="Image" className="body-img-sorrypage" />
    
            <h2 className="sorry-message">Sorry, you cannot<br/> subscribe to the service</h2>
    
           
          
          {/* Terms toggle */}
            <div className="terms-container-sorrypage">
              <button className="terms-toggle-sorrypage" onClick={toggleTerms}>
                Terms and Conditions
              </button>
              {showTerms && (
                <div className="terms-box-sorrypage">
                  <p>Welcome to
                    <strong> FITNESS+.</strong>
                    <br />
                    By subscribing, you agree to the terms and conditions below:
                  </p>
                  <ul>
                    <li>• Subscribing cost is 30$/year.</li>
                    <li>• New subscribers get one day free.</li>
                    <li>
                      • After that, the subscription is renewed automatically.
                    </li>
                    <li>
                      • To cancel the subscription, send PE to 6657 for
                      free.
                    </li>
                    <li>• For support and more info: contact@fitnessplus.co</li>
                  </ul>
                </div>
              )}
    </div>
     </div>
    );
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // import backgroundImage from "../assets/Woman.jpg";
    // import logo from "../assets/logo.png";
    // import { Link } from "react-router-dom";
    // import "../SorryPage.css";

    // const SorryPage = () => {
    //   return (
    //     <div
    //       className="sorry-page-container"
    //       style={{ backgroundImage: url(${backgroundImage}) }}
    //     >
    //         <div className="sorry-overlay"></div>
    //       <nav className="sorry-navbar">
    //         <Link to="/">
    //           <img src={logo} alt="Clothing Logo" className="my-logo" />
    //         </Link>
    //       </nav>
    //       <div className="small-container">
    //         <div className="sorry-message">
    //           <h1>Sorry, you cannot subscribe to the service</h1>
    //         </div>
    //         <div className="sorry-footer">
    //           <p>Welcome to <span className="clothing">Clothing</span>.<br />
    //           By subscribing, you agree to the terms and conditions below:</p><br /><br />
    //           <ul>
    //             <li>Subscribing cost is 30$/year. </li>
    //             <li>New subscribers get one day free;
    //             after that, the subscription is 
    //             renewed automatically.</li>
    //             <li>To cancel the subscription, send GC to 6657 for free.</li>
    //             <li>For support and more information, contact:<br />
    //             contact@clothing.co</li>
    //             </ul>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

    // export default SorryPage;