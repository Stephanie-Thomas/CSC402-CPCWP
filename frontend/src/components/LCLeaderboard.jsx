// frontend/src/components/LCLeaderboard.jsx
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
          const valid = data.find((user) => user.contestTitle);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <p>Loading LeetCode data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '16px', color: '#d32f2f' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleViewModeChange('profile')}
          style={{
            padding: '8px 16px',
            border: '1px solid #555',
            backgroundColor: viewMode === 'profile' ? '#555' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => handleViewModeChange('contest')}
          style={{
            padding: '8px 16px',
            border: '1px solid #555',
            backgroundColor: viewMode === 'contest' ? '#555' : 'transparent',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Contest
        </button>
      </div>

      {viewMode === 'contest' && contestTitle && (
        <h6 style={{ textAlign: 'center', marginBottom: '16px', color: '#fff' }}>
          {contestTitle}
        </h6>
      )}

      <div style={{
        backgroundColor: '#1a1a1a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        marginBottom: '32px',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#212121' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', color: '#fff', fontWeight: 'bold' }}>
                Username
              </th>
              {viewMode === 'profile' ? (
                <>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#fff', fontWeight: 'bold' }}>
                    Total Solved
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#fff', fontWeight: 'bold' }}>
                    Ranking
                  </th>
                </>
              ) : (
                <th style={{ padding: '12px', textAlign: 'right', color: '#fff', fontWeight: 'bold' }}>
                  Contest Ranking
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user.username || index}
                style={{
                  backgroundColor: '#2d2d2d',
                  borderBottom: '1px solid #444',
                  '&:hover': { backgroundColor: '#333' }
                }}
              >
                <td style={{ padding: '12px', color: '#fff' }}>{user.username}</td>
                {viewMode === 'profile' ? (
                  <>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#fff' }}>
                      {user.totalSolved || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#fff' }}>
                      {user.ranking || 'N/A'}
                    </td>
                  </>
                ) : (
                  <td style={{ padding: '12px', textAlign: 'right', color: '#fff' }}>
                    {user.contestRanking !== null &&
                    user.contestRanking !== undefined &&
                    user.contestRanking !== 'N/A'
                      ? user.contestRanking
                      : 'N/A'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LCLeaderboard;