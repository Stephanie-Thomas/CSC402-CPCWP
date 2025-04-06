// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeaderboardToggle from './components/LeaderboardToggle.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>WCCPC Stats Viewer</h1>

        <button
          onClick={() => window.location.href = '/register'}
          className="register-button"
        >
          Register
        </button>

        <Routes>
          <Route path="/" element={<LeaderboardToggle />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
