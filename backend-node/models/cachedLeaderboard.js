const mongoose = require('mongoose');

const leaderboardCacheSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['codeforces', 'leetcode'],
    required: true,
    unique: true, // Ensures only one doc per leaderboard
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Accepts any JSON structure
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LeaderboardCache', leaderboardCacheSchema);
