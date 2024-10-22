import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorString, setErrorString] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const state = params.get('state');
    const isError = params.get('error');
    const errorDescription = params.get('error_description');
    const code = params.get('code');
    
    const verifyCallback = async () => {
      try {
        setLoading(true)
        // Check for CSRF by comparing stored state with returned state
        if (localStorage.getItem('squareState') !== state) {
          setError(true)
          setErrorString('Invalid Request')
          setLoading(false)
          return;
        }
        
        if (isError) {
          if (isError === 'access_denied' && errorDescription === 'user_denied') {
            // Handle user denial case
           setError(true) 
           setErrorString('You denied Leaflet permissions, please try again!')
           setLoading(false)
          } else {
            setErrorString('Unexpected Error, please try again!')
            setError(true)
          }
        } else if (code) {
          // If the authorization was successful and we have a code
          const response = await axios.get('https://leaflet-backend-acb59111b511.herokuapp.com/api/square/token', { params: {code: code} }); // Replace with your API to handle token
          console.log('Token obtained:', response.data);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Error during callback processing:', err);
        setError(true)
        setLoading(false)
        setErrorString(err.message)
      }
    };

    verifyCallback();
  }, []);

  return (
    <div>
      <h1>{loading ? 'Processing your request...' : (error ? errorString : 'Thanks for joining Leaflet!')}</h1>
    </div>
  );
};

export default Callback;
