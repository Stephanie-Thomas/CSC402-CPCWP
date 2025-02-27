// server/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Import routes from the routes folder
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');

// Mount the routes
app.use('/api', apiRoutes);     // endpoints like /api/...
app.use('/auth', authRoutes);         // login endpoint now available at /login

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
