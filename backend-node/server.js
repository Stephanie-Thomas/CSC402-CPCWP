const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config(); // Load environment variables

const apiRoutes = require('./routes/api.js');

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);

    // 🔍 Check for npm debug logs and output to console
    const logDir = '/root/.npm/_logs';
    fs.readdir(logDir, (err, files) => {
      if (err) {
        console.warn("⚠️ Couldn't read npm log directory:", err.message);
        return;
      }

      const debugLogs = files.filter((file) => file.endsWith('.log'));
      if (debugLogs.length === 0) {
        console.log("No npm debug logs found.");
        return;
      }

      debugLogs.forEach((logFile) => {
        const fullPath = `${logDir}/${logFile}`;
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) {
            console.warn(`Failed to read ${logFile}:`, err.message);
          } else {
            console.log(`Contents of ${logFile}:\n${data}`);
          }

          // Optional: delete the file after reading
          fs.unlink(fullPath, () => {});
        });
      });
    });
  });
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
});

// Middleware
app.use(cors({ origin: 'https://csc402-cpcwp.onrender.com' }));
app.use(express.json());
app.use('/api', apiRoutes);
