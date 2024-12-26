import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import ProblemPage from './components/ProblemPage/ProblemPage';
import ServicesPage from './components/ServicesPage/ServicesPage';
import RestaurantPage from './components/RestaurantPage/RestaurantPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
          <Route path="/main/:room/*" element={<MainPage onLogout={handleLogout} />} />
          <Route path="/main/:roomId/problem" element={<ProblemPage />} />
          <Route path="/main/:roomId/services" element={<ServicesPage />} />
          <Route path="/main/:roomId/restaurant" element={<RestaurantPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;