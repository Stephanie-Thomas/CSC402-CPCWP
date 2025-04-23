const express = require('express');
const axios = require('axios');
const redisClient = require('../redisClient');
const User = require('../models/userModel');

const router = express.Router();
const LEETCODE_API_BASE = "https://wculeetcode-api.onrender.com";

// === Codeforces Leaderboard ===
router.get('/codeforces-leaderboard', async (req, res) => {
  const cacheKey = 'Codeforcesleaderboard';

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));
  } catch (err) {
    console.error('Redis error (Codeforces):', err);
  }

  try {
    const users = (await User.find({}, 'codeforcesUsername'))
      .map(u => u.codeforcesUsername)
      .filter(Boolean);

    const leaderboard = [];

    for (const user of users) {
      try {
        const res = await axios.get(`https://codeforces.com/api/user.info?handles=${user}`);
        const info = res?.data?.result?.[0];
        leaderboard.push({
          handle: info?.handle || user,
          rating: info?.rating || null,
          rank: info?.rank || 'N/A',
        });
      } catch {
        leaderboard.push({ handle: user, rating: null, rank: 'N/A' });
      }
    }

    await redisClient.setEx(cacheKey, 120, JSON.stringify(leaderboard)); // 2-minute cache
    res.json(leaderboard);
  } catch (err) {
    console.error('Fetch error (Codeforces):', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Leetcode leaderboard endpoint
router.get('/leetcode-leaderboard', async (req, res) => {
  const cacheKey = 'leetcodeLeaderboard';

  try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
          console.log('Returning cached LeetCode leaderboard data from Redis');
          return res.json(JSON.parse(cachedData));
      }
  } catch (error) {
      console.error('Error accessing Redis cache:', error);
  }

  try {
      const users = (await User.find({}, 'leetcodeUsername'))
      .map(u => u.leetcodeUsername)
      .filter(Boolean);

    const profileDataMap = new Map();
    const contestHistoryMap = new Map();

      for (const username of users) {
      try {
        const [profileResponse, contestResponse] = await Promise.all([
          axios.get(`${LEETCODE_API_BASE}/userProfile/${username}`),
          axios.get(`${LEETCODE_API_BASE}/userContestRankingInfo/${username}`)
        ]);

        profileDataMap.set(username, profileResponse.data);
        contestHistoryMap.set(username, contestResponse.data.data?.userContestRankingHistory || []);
      } catch (error) {
        console.error(`Error fetching data for ${username}:`, error.message);
        profileDataMap.set(username, { totalSolved: 0, ranking: 'N/A' });
        contestHistoryMap.set(username, []);
      }
    }

      // Find global latest valid contest
      let globalLatestStartTime = null;
      for (const [username, history] of contestHistoryMap) {
          for (const entry of history) {
              const ranking = entry.ranking?.toString() || 'N/A';
              if (ranking === 'N/A' || ranking === '0') continue;

              const contest = entry.contest;
              if (contest?.startTime) {
                  const startTime = parseInt(contest.startTime);
                  if (!globalLatestStartTime || startTime > globalLatestStartTime) {
                      globalLatestStartTime = startTime;
                  }
              }
          }
      }

      // Build leaderboard
      const leaderboard = [];
      for (const username of users) {
          const profile = profileDataMap.get(username) || {};
          const history = contestHistoryMap.get(username) || [];
          
          let contestRanking = 'N/A';
          let contestTitle = null;
          
          if (globalLatestStartTime) {
              for (const entry of history) {
                  const contest = entry.contest || {};
                  if (contest.startTime?.toString() === globalLatestStartTime?.toString()) {
                      contestRanking = entry.ranking?.toString() || 'N/A';
                      contestTitle = contest.title || null;
                      break;
                  }
              }
          }

          leaderboard.push({
              username,
              totalSolved: profile.totalSolved || 0,
              overallRanking: profile.ranking?.toString() || 'N/A',
              contestRanking,
              contestTitle
          });
      }

      // Sort leaderboard
      leaderboard.sort((a, b) => {
          if (a.contestRanking === 'N/A') return 1;
          if (b.contestRanking === 'N/A') return -1;
          return parseInt(a.contestRanking) - parseInt(b.contestRanking);
      });

      await redisClient.setEx(cacheKey, 900, JSON.stringify(leaderboard));
      console.log('LeetCode leaderboard data cached in Redis');
      res.json(leaderboard);
  } catch (error) {
      console.error('Error fetching LeetCode leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});


// === Register User ===
router.post('/register', async (req, res) => {
  try {
    const { name, email, leetcodeUsername, codeforcesUsername } = req.body;

    if (!name || !email || (!leetcodeUsername && !codeforcesUsername)) {
      return res.status(400).json({ message: "Name, email, and at least one username are required." });
    }

    if (!email.toLowerCase().endsWith("@wcupa.edu")) {
      return res.status(400).json({ message: "Only @wcupa.edu emails are allowed." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const newUser = new User({ name, email, leetcodeUsername, codeforcesUsername });
    await newUser.save();

    await redisClient.del('Codeforcesleaderboard');
    await redisClient.del('leetcodeLeaderboard');

    res.status(201).json({ message: "Successfully registered." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// === User Count ===
router.get('/member-count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting member count:', error);
    res.status(500).json({ error: 'Failed to retrieve member count' });
  }
});

module.exports = router;
