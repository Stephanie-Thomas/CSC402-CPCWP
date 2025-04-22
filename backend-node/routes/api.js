const express = require('express');
const axios = require('axios');
const redisClient = require('../redisClient');
const User = require('../models/userModel');

const router = express.Router();
const LEETCODE_API_BASE = "https://alfa-leetcode-api.onrender.com";

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

// === LeetCode Leaderboard ===
// === LeetCode Leaderboard ===
router.get('/leetcode-leaderboard', async (req, res) => {
  const cacheKey = 'leetcodeLeaderboard';

  try {
    // Optional: clear cache manually here if needed
    // await redisClient.del(cacheKey);

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));
  } catch (err) {
    console.error('Redis error (Leetcode):', err);
  }

  try {
    const users = (await User.find({}, 'leetcodeUsername'))
      .map(u => u.leetcodeUsername)
      .filter(Boolean);

    const profileMap = new Map();
    const historyMap = new Map();

    for (const username of users) {
      try {
        const [profile, history] = await Promise.all([
          axios.get(`${LEETCODE_API_BASE}/userProfile/${username}`),
          axios.get(`${LEETCODE_API_BASE}/userContestRankingInfo/${username}`),
        ]);
        profileMap.set(username, profile.data);
        historyMap.set(username, history.data.data?.userContestRankingHistory || []);
      } catch {
        profileMap.set(username, { totalSolved: 0, ranking: 'N/A' });
        historyMap.set(username, []);
      }
    }

    // Step 1: Find the most recent contest any user participated in
    let latestTime = null;

    for (const hist of historyMap.values()) {
      for (const e of hist) {
        const t = parseInt(e?.contest?.startTime);
        if (e?.ranking && e.ranking !== '0' && (!latestTime || t > latestTime)) {
          latestTime = t;
        }
      }
    }

    // Step 2: Build leaderboard based on participation in that contest
    const leaderboard = users.map(username => {
      const profile = profileMap.get(username) || {};
      const history = historyMap.get(username) || [];

      let contestRanking = 'N/A';
      let contestTitle = null;

      for (const entry of history) {
        if (entry?.contest?.startTime?.toString() === latestTime?.toString()) {
          contestRanking = entry.ranking?.toString() || 'N/A';
          contestTitle = entry.contest.title || null;
          break;
        }
      }

      return {
        username,
        totalSolved: profile.totalSolved || 0,
        overallRanking: profile.ranking?.toString() || 'N/A',
        contestRanking,
        contestTitle,
        score: contestRanking !== 'N/A' ? parseInt(contestRanking) : Infinity
      };
    });

    // Step 3: Sort by contest rank; N/A goes to the bottom
    leaderboard.sort((a, b) => a.score - b.score);

    await redisClient.setEx(cacheKey, 120, JSON.stringify(leaderboard));
    res.json(leaderboard);
  } catch (err) {
    console.error('Fetch error (Leetcode):', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
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
