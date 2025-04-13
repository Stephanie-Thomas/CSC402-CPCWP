// backend-node/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const apiRoutes = require('./routes/api.js');

const app = express(); // ✅ Define app first

// ✅ Log every request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors({ origin: 'https://csc402-cpcwp.onrender.com' })); // Allow frontend origin
app.use(express.json());
app.use('/api', apiRoutes);

console.log("📁 Starting backend...");
console.log("🌐 MONGO_URI:", process.env.MONGO_URI || "❌ Not defined");

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");

  // Start the server only after successful DB connection
  app.listen(process.env.PORT || 10000, () => {
    console.log(`Server running on port ${process.env.PORT || 10000}`);
  });
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
});
