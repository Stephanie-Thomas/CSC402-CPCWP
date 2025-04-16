const express = require('express');
const axios = require('axios');
const redisClient = require('../redisClient');
const User = require('../models/userModel');

const router = express.Router();

const LEETCODE_API_BASE = "https://alfa-leetcode-api.onrender.com";

// Codeforces leaderboard endpoint
router.get('/codeforces-leaderboard', async (req, res) => {
  const cacheKey = 'Codeforcesleaderboard';

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.error('Redis error (Codeforces):', error);
  }

  try {
    const usersFromDB = await User.find({}, 'codeforcesUsername');
    const users = usersFromDB
      .map(user => user.codeforcesUsername)
      .filter(Boolean);

    const leaderboard = [];

    for (const user of users) {
      try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${user}`);
        const userData = response?.data?.result?.[0];
        leaderboard.push({
          handle: userData?.handle || user,
          rating: userData?.rating || null,
          rank: userData?.rank || 'N/A'
        });
      } catch {
        leaderboard.push({ handle: user, rating: null, rank: 'N/A' });
      }
    }

    await redisClient.setEx(cacheKey, 900, JSON.stringify(leaderboard));
    res.json(leaderboard);
  } catch (error) {
    console.error('Codeforces fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// Leetcode leaderboard endpoint
router.get('/leetcode-leaderboard', async (req, res) => {
  const cacheKey = 'leetcodeLeaderboard';

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.error('Redis error (Leetcode):', error);
  }

  try {

    const usersFromDB = await User.find({}, 'leetcodeUsername');
    const users = usersFromDB
      .map(user => user.leetcodeUsername)
      .filter(Boolean);


    const profileDataMap = new Map();
    const contestHistoryMap = new Map();

    for (const username of users) {
      try {
        const [profileRes, contestRes] = await Promise.all([
          axios.get(`${LEETCODE_API_BASE}/userProfile/${username}`),
          axios.get(`${LEETCODE_API_BASE}/userContestRankingInfo/${username}`)
          
        ]);
        profileDataMap.set(username, profileRes.data);
        contestHistoryMap.set(username, contestRes.data.data?.userContestRankingHistory || []);
      } catch {
        profileDataMap.set(username, { totalSolved: 0, ranking: 'N/A' });
        contestHistoryMap.set(username, []);
      }
    }

    let globalLatestStartTime = null;
    for (const history of contestHistoryMap.values()) {
      for (const entry of history) {
        const time = parseInt(entry?.contest?.startTime);
        const rank = entry?.ranking?.toString();
        if (rank && rank !== 'N/A' && rank !== '0' && (!globalLatestStartTime || time > globalLatestStartTime)) {
          globalLatestStartTime = time;
        }
      }
    }

    const leaderboard = users.map(username => {
      const profile = profileDataMap.get(username) || {};
      const history = contestHistoryMap.get(username) || [];
      let contestRanking = 'N/A';
      let contestTitle = null;

      if (globalLatestStartTime) {
        for (const entry of history) {
          if (entry?.contest?.startTime?.toString() === globalLatestStartTime.toString()) {
            contestRanking = entry.ranking?.toString() || 'N/A';
            contestTitle = entry.contest.title || null;
            break;
          }
        }
      }

      return {
        username,
        totalSolved: profile.totalSolved || 0,
        overallRanking: profile.ranking?.toString() || 'N/A',
        contestRanking,
        contestTitle
      };
    });

    leaderboard.sort((a, b) => {
      if (a.contestRanking === 'N/A') return 1;
      if (b.contestRanking === 'N/A') return -1;
      return parseInt(a.contestRanking) - parseInt(b.contestRanking);
    });

    await redisClient.setEx(cacheKey, 1810, JSON.stringify(leaderboard));
    res.json(leaderboard);
  } catch (error) {
    console.error('Leetcode fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, leetcodeUsername, codeforcesUsername } = req.body;

    if (!name || !email || !leetcodeUsername || !codeforcesUsername) {
      return res.status(400).json({ message: "All fields are required." });
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
    // Clear leaderboard cache
    await redisClient.del('Codeforcesleaderboard');
    await redisClient.del('leetcodeLeaderboard');
    
    return res.status(201).json({ message: "Successfully registered." });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//refresh and pull new redis cache
router.post('/refresh-leaderboards', async (req, res) => {
  try {
    await redisClient.del('Codeforcesleaderboard');
    await redisClient.del('leetcodeLeaderboard');
    res.status(200).json({ message: "Leaderboard cache cleared" });
  } catch (error) {
    console.error("Error clearing leaderboard cache:", error);
    res.status(500).json({ message: "Failed to refresh leaderboard cache" });
  }
});

module.exports = router;
