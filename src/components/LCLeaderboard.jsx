// src/components/LCLeaderboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from '@mui/material';

const LCLeaderboard = () => {
  // "profile" shows totalSolved & profile ranking; "contest" shows contest ranking.
  const [viewMode, setViewMode] = useState('profile');
  const [leaderboard, setLeaderboard] = useState([]);
  const [contestTitle, setContestTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data whenever the viewMode changes.
  useEffect(() => {
    setLoading(true);
    setError(null);
    // We fetch from the same backend endpoint; it now returns both profile and contest data.
    fetch('http://localhost:5001/api/leetcode-leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Leetcode leaderboard data');
        }
        return response.json();
      })
      .then((data) => {
        if (viewMode === 'contest') {
          // In contest mode, sort is already handled by the backend.
          // Extract a contest title from the first user that has one.
          const valid = data.find((user) => user.contestTitle);
          setContestTitle(valid ? valid.contestTitle : 'Contest Rankings');
        } else {
          setContestTitle('');
        }
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [viewMode]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography>Loading Leetcode data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 2, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="Leetcode view mode"
        sx={{
          mb: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <ToggleButton
          value="profile"
          aria-label="Profile view"
          sx={{
            color: 'text.primary',
            '&.Mui-selected': { backgroundColor: 'grey.800' },
          }}
        >
          Profile
        </ToggleButton>
        <ToggleButton
          value="contest"
          aria-label="Contest view"
          sx={{
            color: 'text.primary',
            '&.Mui-selected': { backgroundColor: 'grey.800' },
          }}
        >
          Contest
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'contest' && contestTitle && (
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
          {contestTitle}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="Leetcode leaderboard table">
          <TableHead sx={{ backgroundColor: 'grey.900' }}>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Username
              </TableCell>
              {viewMode === 'profile' ? (
                <>
                  <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Total Solved
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Ranking
                  </TableCell>
                </>
              ) : (
                <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  Contest Ranking
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow
                key={user.username || index}
                sx={{
                  backgroundColor: 'background.default',
                  '&:hover': { backgroundColor: 'grey.800' },
                }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'text.primary' }}>
                  {user.username}
                </TableCell>
                {viewMode === 'profile' ? (
                  <>
                    <TableCell align="right" sx={{ color: 'text.primary' }}>
                      {user.totalSolved || 'N/A'}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.primary' }}>
                      {user.ranking || 'N/A'}
                    </TableCell>
                  </>
                ) : (
                  <TableCell align="right" sx={{ color: 'text.primary' }}>
                    {user.contestRanking !== null &&
                    user.contestRanking !== undefined &&
                    user.contestRanking !== 'N/A'
                      ? user.contestRanking
                      : 'N/A'}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LCLeaderboard;
