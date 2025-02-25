// src/components/LeetcodeLeaderboard.js
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading Leetcode data...</p>
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
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        maxWidth: 800,
        margin: '20px auto',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="Leetcode leaderboard table">
        <TableHead sx={{ backgroundColor: 'grey.900' }}>
          <TableRow>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              Username
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Total Solved
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Ranking
            </TableCell>
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
              <TableCell align="right" sx={{ color: 'text.primary' }}>
                {user.totalSolved || 'N/A'}
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.primary' }}>
                {user.ranking || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeetcodeLeaderboard;
