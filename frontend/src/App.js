// src/App.js
import React, { useState } from 'react';
import LeaderboardToggle from './components/LeaderboardToggle.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './App.css';

const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="App">
      <h1>WCCPC Stats Viewer</h1>

      <button
        onClick={() => setShowRegister((prev) => !prev)}
        className="register-button"
      >
        {showRegister ? '← Back to Leaderboard' : 'Register'}
      </button>

      {showRegister ? <RegisterForm /> : <LeaderboardToggle />}
    </div>
  );
};

export default App;
