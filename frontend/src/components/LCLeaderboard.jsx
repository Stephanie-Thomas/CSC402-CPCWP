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
          // Find a user with a valid contest title and a contest ranking not equal to "0"
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

  // For contest view, sort leaderboard so that rankings of "0" (treated as "N/A") and "N/A" come last.
  const sortedLeaderboard = viewMode === 'contest'
    ? [...leaderboard].sort((a, b) => {
        const parseRank = (rank) => {
          if (rank === "0" || rank === "N/A") {
            return Infinity;
          }
          return parseInt(rank, 10);
        };
        return parseRank(a.contestRanking) - parseRank(b.contestRanking);
      })
    : leaderboard;

    const containerStyle = {
      maxWidth: '800px',
      margin: '1.5rem auto',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      border: '1px solid #e0e0e0',
    };
  
    const buttonContainerStyle = {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginBottom: '16px',
    };
  
    const buttonStyle = {
      padding: '6px 16px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      color: '#444',
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
  
    const tableContainerStyle = {
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      overflowX: 'auto',
    };
  
    const headerStyle = {
      backgroundColor: '#f8f9fa',
      color: '#2d2d2d',
    };
  
    const headerCellStyle = {
      padding: '12px 16px',
      fontWeight: '500',
      fontSize: '13px',
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
      <div style={{ textAlign: 'center', padding: '20px', color: 'black' }}>
        <p>Loading LeetCode data...</p>
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
        <h6 style={{ 
          textAlign: 'center', 
          marginBottom: '16px', 
          color: '#666', 
          fontSize: '14px',
          fontWeight: '500'
          }}>
          {contestTitle}
        </h6>
      )}

      <div style={tableContainerStyle}>
        <table>
          <thead style={headerStyle}>
            <tr>
              <th style={{ ...headerCellStyle, textAlign: 'left' }}>Username</th>
              {viewMode === 'profile' ? (
                <>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Total Solved</th>
                  <th style={{ ...headerCellStyle, textAlign: 'right' }}>Ranking</th>
                </>
              ) : (
                <th style={{ ...headerCellStyle, textAlign: 'right' }}>Contest Ranking</th>
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
                <td style={{ ...cellStyle, textAlign: 'left', fontWeight: '500' }}>{user.username}</td>
                {viewMode === 'profile' ? (
                  <>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>
                      {user.totalSolved || 'N/A'}
                    </td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>
                      {user.ranking || 'N/A'}
                    </td>
                  </>
                ) : (
                  <td style={{ ...cellStyle, textAlign: 'right' }}>
                    {(user.contestRanking === "0" || user.contestRanking === "N/A")
                      ? 'N/A'
                      : user.contestRanking}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>
        {`
          .leaderboard-row:hover {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};

export default LCLeaderboard;
