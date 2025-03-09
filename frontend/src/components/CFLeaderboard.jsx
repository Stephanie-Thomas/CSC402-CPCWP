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

  // Styles
  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
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
    fontWeight: 'bold',
    padding: '12px',
  };

  const rowStyle = {
    backgroundColor: '#f8f9fa',
  };

  const cellStyle = {
    padding: '12px',
    color: '#333333',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading Codeforces data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
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
              <th scope="row" style={{ ...cellStyle, textAlign: 'left' }}>
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
            background-color: #e9ecef;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default CodeforcesLeaderboard;