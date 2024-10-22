import './App.css';
import sha256 from 'crypto-js/sha256';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './Callback'; // Import your Callback component

function App() {
  const handleClick = () => {
    const base64Encode = (buffer) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; len > i; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    let stateArr = new Uint8Array(12);
    window.crypto.getRandomValues(stateArr);
    const state = base64Encode(stateArr);

    // Store the code verifier and state in local storage
    localStorage.setItem('squareState', state);

    

    // Redirect to Square authorization
    window.location.href = `https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-pSvOzdRraQH44MYWXvKeGQ&scope=MERCHANT_PROFILE_READ+ORDERS_READ+PAYMENTS_READ&session=false&state=${state}`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <div className="content">
              <h1>Welcome to Leaflet!</h1>
              <p>Become a merchant today and grow your business with us.</p>
              <button className="join-button" onClick={handleClick}>
                Click here to join Leaflet as Merchant!
              </button>
            </div>
          </div>
        }/>
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
