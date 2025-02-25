// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const redis = require('redis');

const app = express();
const PORT = 5001;

app.use(cors());

// Create and configure the Redis client (default settings: localhost:6379)
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

// Existing Codeforces endpoint (unchanged)
app.get('/api/leaderboard', async (req, res) => {
  const cacheKey = 'leaderboard';

  try {
    const cachedLeaderboard = await redisClient.get(cacheKey);
    if (cachedLeaderboard) {
      console.log('Returning cached Codeforces leaderboard data from Redis');
      return res.json(JSON.parse(cachedLeaderboard));
    }
  } catch (error) {
    console.error('Error accessing Redis cache:', error);
  }

  try {
    const users = ['tourist', 'Petr', 'Benq', 'Radewoosh', 'mnbvmar', 'hello'];
    const responses = await Promise.all(
      users.map(user =>
        axios.get(`https://codeforces.com/api/user.info?handles=${user}`)
      )
    );

    const leaderboard = responses.map(response => {
      const user = response.data.result[0];
      return {
        username: user.handle,
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
        maxRank: user.maxRank
      };
    });

    await redisClient.setEx(cacheKey, 120, JSON.stringify(leaderboard));
    console.log('Codeforces leaderboard data cached in Redis');
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching Codeforces leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// New endpoint for Leetcode leaderboard using /userProfile/:username
app.get('/api/leetcode-leaderboard', async (req, res) => {
  const cacheKey = 'leetcodeLeaderboard';

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached Leetcode leaderboard data from Redis');
      return res.json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.error('Error accessing Redis cache:', error);
  }

  try {
    // Replace these with the actual Leetcode usernames you want to display
    const users = ['hello', 'kmatotek', 'dude'];
    const responses = await Promise.all(
      users.map(async (username) => {
        try {
          const response = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
          const data = response.data;
          return {
            username,             // use the username from our list
            totalSolved: data.totalSolved,
            ranking: data.ranking
          };
        } catch (error) {
          console.error(`Error fetching data for ${username}:`, error);
          // Return a default object; using 0 for totalSolved so sorting works correctly.
          return {
            username,
            totalSolved: 0,
            ranking: 'N/A'
          };
        }
      })
    );

    // Sort the leaderboard by totalSolved in descending order
    responses.sort((a, b) => b.totalSolved - a.totalSolved);

    await redisClient.setEx(cacheKey, 120, JSON.stringify(responses));
    console.log('Leetcode leaderboard data cached in Redis');
    res.json(responses);
  } catch (error) {
    console.error('Error fetching Leetcode leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch Leetcode leaderboard data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
