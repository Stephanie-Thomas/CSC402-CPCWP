import React, { useEffect, useState } from 'react';

const LCLeaderboard = () => {
  const [viewMode, setViewMode] = useState('profile');
  const [leaderboard, setLeaderboard] = useState([]);
  const [contestTitle, setContestTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/leetcode-leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch LeetCode leaderboard data: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (viewMode === 'contest') {
          const valid = data.find((user) => user.contestTitle && user.contestRanking !== "0");
          setContestTitle(valid ? valid.contestTitle : 'Contest Rankings');
        } else {
          setContestTitle('');
        }
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [viewMode]);

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
  };

  const sortedLeaderboard = viewMode === 'contest'
    ? [...leaderboard].sort((a, b) => {
        const parseRank = (rank) => {
          if (rank === "0" || rank === "N/A") return Infinity;
          return parseInt(rank, 10);
        };
        return parseRank(a.contestRanking) - parseRank(b.contestRanking);
      })
    : leaderboard;

  // Styles matching Codeforces version
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

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    margin: '16px 0',
  };

  const buttonStyle = {
    padding: '6px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    color: '#2d2d2d',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    color: '#2196f3',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'black' }}>
        <p>Loading LeetCode data...</p>
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
      <div style={buttonContainerStyle}>
        <button
          onClick={() => handleViewModeChange('profile')}
          style={viewMode === 'profile' ? activeButtonStyle : buttonStyle}
        >
          Profile
        </button>
        <button
          onClick={() => handleViewModeChange('contest')}
          style={viewMode === 'contest' ? activeButtonStyle : buttonStyle}
        >
          Contest
        </button>
      </div>

      {viewMode === 'contest' && contestTitle && (
        <div style={{ 
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          color: '#666',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {contestTitle}
        </div>
      )}

      <table style={tableStyle}>
        <thead style={headerStyle}>
          <tr>
            <th style={headerCellStyle}>Username</th>
            {viewMode === 'profile' ? (
              <>
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Solved</th>
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Rank</th>
              </>
            ) : (
              <th style={{ ...headerCellStyle, textAlign: 'right' }}>Contest Rank</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedLeaderboard.map((user, index) => (
            <tr
              key={user.username || index}
              className="leaderboard-row"
              style={rowStyle}
            >
              <td style={{ ...cellStyle, fontWeight: '500' }}>{user.username}</td>
              {viewMode === 'profile' ? (
                <>
                  <td style={{ ...cellStyle, textAlign: 'right' }}>
                    {user.totalSolved || 'N/A'}
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'right' }}>
                    {user.overallRanking || 'N/A'}
                  </td>
                </>
              ) : (
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  {(user.contestRanking === "0" || user.contestRanking === "N/A")
                    ? 'N/A'
                    : `#${user.contestRanking}`}
                </td>
              )}
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

export default LCLeaderboard;