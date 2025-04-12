// backend-node/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const apiRoutes = require('./routes/api.js');

const app = express();
const PORT = process.env.PORT || 10000;

//Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB Atlas");

    // Start the server only after successful DB connection
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

// Middleware
app.use(cors({ origin: 'https://csc402-cpcwp.onrender.com' })); // Allow frontend origin
app.use(express.json());
app.use('/api', apiRoutes);
