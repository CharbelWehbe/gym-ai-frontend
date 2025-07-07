// import '../Signin.css';
// import { useState } from 'react';
// import 'react-phone-input-2/lib/style.css';
// import PhoneInput from 'react-phone-input-2';

// export default function Signin() {
//  // const [countryCode, ] = useState('+961');
//   const [phone, setPhone] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     //const fullNumber = `${countryCode}${phone}`;
//    // console.log("Phone number:", fullNumber);
//         console.log('Phone number:', '+' + phone); // formatted with country code

//     // handle continue logic here
//   };

//   return (
//       <div className="body-image-signin">
//       <img src="/body-image.png" alt="Image" className="body-img-signin" />

//       <form className="signin-form" onSubmit={handleSubmit}>
//         <h2 className="signin-title">Enter your mobile number to receive an OTP</h2>

//          {/* <div className="phone-input-wrapper">
//           <PhoneInput
//             country={'lb'} // default country Lebanon
//             value={phone}
//             onChange={setPhone}
//             inputClass="phone-input"
//             containerClass="phone-container"
//             inputStyle={{ width: '100%' }}
//             countryCodeEditable={false}
//             enableSearch={true}
 
//           />
//         </div> */}
        
//         <PhoneInput
//           country={'lb'}
//           value={phone}
//           onChange={setPhone}
//           inputClass="phone-input"
//           containerClass="phone-container"
//            inputStyle={{ width: '100%' }}
//           countryCodeEditable={false}
//           enableSearch={true}
          
//           inputProps={{
//             name: 'phone',
//             required: true,
//                 autoFocus: true,

//             placeholder: 'Enter your mobile number',
//           }}
//         />
//         <button type="submit" className="continue-button">Continue</button>
//       </form>
//     </div>
//   );
// }
/*
import '../Signin.css';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export default function Signin() {
  //const [countryCode, setCountryCode] = useState('+961');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //const fullNumber = `${countryCode}${phone}`;
    console.log("Phone number:", '+' + phone);
    // handle continue logic here
  };

  return (
      <div className="body-image-signin">
      <img src="/body-image.png" alt="Image" className="body-img-signin" />

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Enter your mobile number to receive an OTP</h2>

        <div className="phone-input-wrapper">
          
          <PhoneInput
          country={'lb'}
            type="tel"
            placeholder="Enter phone number"
            className="phone-input"
            value={phone}
                        inputStyle={{ width: '100%' }}

            onChange={setPhone}
            countryCodeEditable={false}
            enableSearch={true}
            required
          />

        </div>

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
}*/

import '../Signin.css';
import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export default function Signin() {
  const [countryCode, ] = useState('+961');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullNumber = `${countryCode}${phone}`;
    console.log("Phone number:", fullNumber);
    // handle continue logic here
  };

  return (
      <div className="body-image-signin">
      <img src="/body-image.png" alt="Image" className="body-img-signin" />

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Enter your mobile number to receive an OTP</h2>

         <div className="phone-input-wrapper">
          <PhoneInput
            country={'lb'} // default country Lebanon
            value={phone}
            onChange={setPhone}
            inputClass="phone-input"
            containerClass="phone-container"
            inputStyle={{ width: '100%' }}
            countryCodeEditable={false}
            enableSearch={true}
          />
        </div>
        <button type="submit" className="continue-button">Continue</button>
      </form>
 </div>
);
}