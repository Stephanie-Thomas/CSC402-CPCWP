// src/components/CodeforcesLeaderboard.js
import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const CodeforcesLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Codeforces leaderboard data');
        }
        return response.json();
      })
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Codeforces leaderboard:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading Codeforces data...</p>
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
      <h1 className="leaderboard-header">Codeforces Leaderboard</h1>
      <div className="table-responsive">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Rating</th>
              <th>Max Rating</th>
              <th>Rank</th>
              <th>Max Rank</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.rating || 'N/A'}</td>
                <td>{user.maxRating || 'N/A'}</td>
                <td>{user.rank}</td>
                <td>{user.maxRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodeforcesLeaderboard;
