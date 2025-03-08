// backend/routes/api.js
const express = require('express');
const axios = require('axios');
const redis = require('redis');

const router = express.Router();

// Create and configure the Redis client using environment variables
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost', // Default to localhost for non-Docker testing
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection established');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Codeforces leaderboard endpoint (unchanged)
router.get('/codeforces-leaderboard', async (req, res) => {
  const cacheKey = 'Codeforcesleaderboard';

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
      users.map((user) =>
        axios.get(`https://codeforces.com/api/user.info?handles=${user}`)
      )
    );

    const leaderboard = responses.map((response) => {
      const user = response.data.result[0];
      return {
        username: user.handle,
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
        maxRank: user.maxRank,
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

// Leetcode leaderboard endpoint (updated to use leetcode_api)
router.get('/leetcode-leaderboard', async (req, res) => {
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
    const users = ['kmatotek', 'vVa3haPhIY', 'Kaushal_Aknurwar', 'Junglee_Coder'];
    const responses = await Promise.all(
      users.map(async (username) => {
        try {
          const [profileResponse, contestResponse] = await Promise.all([
            axios.get(`http://leetcode_api:3000/userProfile/${username}`),
            axios.get(`http://leetcode_api:3000/userContestRankingInfo/${username}`),
          ]);
          const profileData = profileResponse.data;
          const contestData = contestResponse.data;

          let contestRanking = null;
          let contestTitle = null;
          const history = contestData.data?.userContestRankingHistory;
          if (history && Array.isArray(history) && history.length > 0) {
            const lastContest = history[history.length - 1];
            contestRanking = lastContest.ranking || 'N/A';
            contestTitle = lastContest.contest?.title || null;
          }

          return {
            username,
            totalSolved: profileData.totalSolved,
            ranking: profileData.ranking,
            contestRanking,
            contestTitle,
          };
        } catch (error) {
          console.error(`Error fetching data for ${username} from leetcode_api:`, error);
          return {
            username,
            totalSolved: 0,
            ranking: 'N/A',
            contestRanking: 'N/A',
            contestTitle: null,
          };
        }
      })
    );

    responses.sort((a, b) => {
      const rankA = typeof a.contestRanking === 'number' ? a.contestRanking : Infinity;
      const rankB = typeof b.contestRanking === 'number' ? b.contestRanking : Infinity;
      return rankA - rankB;
    });

    await redisClient.setEx(cacheKey, 120, JSON.stringify(responses));
    console.log('Leetcode leaderboard data (with contest ranking) cached in Redis');
    res.json(responses);
  } catch (error) {
    console.error('Error fetching Leetcode leaderboard from leetcode_api:', error);
    res.status(500).json({ error: 'Failed to fetch Leetcode leaderboard data' });
  }
});

module.exports = router;