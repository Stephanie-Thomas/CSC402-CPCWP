// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LeaderboardToggle from './components/LeaderboardToggle';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // Optionally override additional palette values here.
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <LeaderboardToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
