import React, { useState } from 'react';
import CodeforcesLeaderboard from './CFLeaderboard';
import LeetcodeLeaderboard from './LCLeaderboard';
import './LeaderboardToggle.css';

const LeaderboardToggle = () => {
  const [activeTab, setActiveTab] = useState('codeforces');

  return (
    <div className="leaderboard-toggle-container">
      <div className="toggle-buttons">
        <button
          className={activeTab === 'codeforces' ? 'active' : ''}
          onClick={() => setActiveTab('codeforces')}
        >
          Codeforces
        </button>
        <button
          className={activeTab === 'leetcode' ? 'active' : ''}
          onClick={() => setActiveTab('leetcode')}
        >
          Leetcode
        </button>
      </div>
      <div className="leaderboard-content">
        {activeTab === 'codeforces' ? (
          <CodeforcesLeaderboard />
        ) : (
          <LeetcodeLeaderboard />
        )}
      </div>
    </div>
  );
};

export default LeaderboardToggle;