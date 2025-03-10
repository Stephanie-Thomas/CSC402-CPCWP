import React, { useEffect, useState } from 'react';

const CodeforcesLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/codeforces-leaderboard')
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
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const containerStyle = {
    maxWidth: '900px',
    margin: '2rem auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    overflowX: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '650px',
  };

  const headerStyle = {
    backgroundColor: '#212121',
    color: '#ffffff',
  };

  const headerCellStyle = {
    padding: '14px 16px',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const rowStyle = {
    backgroundColor: '#2d2d2d',
    borderBottom: '1px solid #444',
    transition: 'background-color 0.2s ease',
  };

  const cellStyle = {
    padding: '14px 16px',
    color: '#e0e0e0',
    fontSize: '14px',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#ffffff' }}>
        <p>Loading Codeforces data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle} aria-label="Codeforces leaderboard">
        <thead style={headerStyle}>
          <tr>
            <th style={{ ...headerCellStyle, textAlign: 'left' }}>Username</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Rating</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Max Rating</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Rank</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Max Rank</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user.username || index}
              className="leaderboard-row"
              style={rowStyle}
            >
              <th scope="row" style={{ ...cellStyle, textAlign: 'left', fontWeight: '500' }}>
                {user.username}
              </th>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                {user.rating || 'N/A'}
              </td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                {user.maxRating || 'N/A'}
              </td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                {user.rank || 'N/A'}
              </td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                {user.maxRank || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>
        {`
          .leaderboard-row:hover {
            background-color: #333333;
          }
        `}
      </style>
    </div>
  );
};

export default CodeforcesLeaderboard;