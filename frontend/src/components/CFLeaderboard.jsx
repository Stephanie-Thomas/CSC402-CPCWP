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
    maxWidth: '800px',
    margin: '1.5rem auto',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    overflowX: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  };

  const headerStyle = {
    backgroundColor: '#f8f9fa',
    color: '#2d2d2d',
  };

  const headerCellStyle = {
    padding: '12px 16px',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'left',
  };

  const rowStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  };

  const cellStyle = {
    padding: '12px 16px',
    color: '#444',
    fontSize: '14px',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        <p>Loading Codeforces data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <table style={tableStyle} aria-label="Codeforces leaderboard">
        <thead style={headerStyle}>
          <tr>
            <th style={headerCellStyle}>Username</th>
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
              <td style={{ ...cellStyle, fontWeight: '500' }}>
                {user.username}
              </td>
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
            background-color: #f8f9fa !important;
          }
        `}
      </style>
    </div>
  );
};

export default CodeforcesLeaderboard;