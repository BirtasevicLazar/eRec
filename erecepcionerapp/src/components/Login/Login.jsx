import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login({ onLogin, isAuthenticated }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get('room');
    if (room) {
      setRoomNumber(room);
      console.log(`Room number: ${room}`);
    }
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      const room = searchParams.get('room') || location.state?.room || localStorage.getItem('roomNumber');
      navigate(`/main/${room}`, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams, location]);

  useEffect(() => {
    const room = searchParams.get('room') || location.state?.room;
    if (room) {
      setRoomNumber(room);
      localStorage.setItem('roomNumber', room);
    } else {
      setMessage(t('roomNumberMissing'));
    }
  }, [searchParams, location, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!roomNumber) {
      setMessage(t('roomNumberMissing'));
      return;
    }

    try {
      const response = await fetch('http://localhost:8888/api/check_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Received response is not in JSON format");
      }

      const result = await response.json();
      console.log(result); // Dodaj ovo za debugovanje
      
      if (result.exists) {
        setMessage(t('emailExists'));
        localStorage.setItem('userEmail', email); // Dodaj ovu liniju
        onLogin();
        navigate(`/main/${roomNumber}`, { replace: true });
      } else {
        setMessage(t('emailNotExists'));
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setMessage(t('errorOccurred'));
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <form className="login-form bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        <h2 className="mb-4">{t('login')}</h2>
        <div className="form-group">
          <label htmlFor="email">{t('email')}:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">{t('login')}</button>
        {message && <div className="alert alert-danger mt-3">{message}</div>}
        <div className="mt-3">
          <button type="button" className="btn btn-link" onClick={() => changeLanguage('en')}>English</button>
          <button type="button" className="btn btn-link" onClick={() => changeLanguage('sr')}>Srpski</button>
        </div>
      </form>
    </div>
  );
}

export default Login;