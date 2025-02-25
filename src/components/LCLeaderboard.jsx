// src/components/LeetcodeLeaderboard.js
import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const LeetcodeLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/leetcode-leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Leetcode leaderboard data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leetcode leaderboard data:', data);
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Leetcode leaderboard:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading Leetcode data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header">Leetcode Leaderboard</h1>
      <div className="table-responsive">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Total Solved</th>
              <th>Ranking</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.totalSolved || 'N/A'}</td>
                <td>{user.ranking || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeetcodeLeaderboard;
