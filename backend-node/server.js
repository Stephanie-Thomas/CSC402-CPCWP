// backend-node/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const apiRoutes = require('./routes/api.js');

const app = express();
const PORT = process.env.PORT || 4000; // Load from .env
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN; // Load from .env

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*"
})); // Load from .env
app.use(express.json());
app.use('/api', apiRoutes);

setInterval(() => {
  console.log("Server is still running...");
}, 30000); // logs every 30 seconds
