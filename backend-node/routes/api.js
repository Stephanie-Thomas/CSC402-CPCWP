const express = require('express');
const axios = require('axios');
const redisClient = require('../redisClient');
const User = require('../models/userModel');
const CachedLeaderboard = require('../models/cachedLeaderboard');

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
    const doc = await CachedLeaderboard.findOne({ type: 'codeforces' });
    if (doc?.data?.length) return res.json(doc.data);
  } catch (err) {
    console.error('Mongo fallback error (Codeforces):', err);
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

    await redisClient.setEx(cacheKey, 1810, JSON.stringify(leaderboard));

    await CachedLeaderboard.findOneAndUpdate(
      { type: 'codeforces' },
      { data: leaderboard, lastUpdated: new Date() },
      { upsert: true }
    );

    res.json(leaderboard);
  } catch (err) {
    console.error('Fetch error (Codeforces):', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// === LeetCode Leaderboard ===
router.get('/leetcode-leaderboard', async (req, res) => {
  const cacheKey = 'leetcodeLeaderboard';

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));
  } catch (err) {
    console.error('Redis error (Leetcode):', err);
  }

  try {
    const doc = await CachedLeaderboard.findOne({ type: 'leetcode' });
    if (doc?.data?.length) return res.json(doc.data);
  } catch (err) {
    console.error('Mongo fallback error (Leetcode):', err);
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

    let latestTime = null;
    for (const hist of historyMap.values()) {
      for (const e of hist) {
        const t = parseInt(e?.contest?.startTime);
        if (e?.ranking && e.ranking !== '0' && (!latestTime || t > latestTime)) {
          latestTime = t;
        }
      }
    }

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
      };
    });

    leaderboard.sort((a, b) => {
      if (a.contestRanking === 'N/A') return 1;
      if (b.contestRanking === 'N/A') return -1;
      return parseInt(a.contestRanking) - parseInt(b.contestRanking);
    });

    await redisClient.setEx(cacheKey, 1810, JSON.stringify(leaderboard));

    await CachedLeaderboard.findOneAndUpdate(
      { type: 'leetcode' },
      { data: leaderboard, lastUpdated: new Date() },
      { upsert: true }
    );

    res.json(leaderboard);
  } catch (err) {
    console.error('Fetch error (Leetcode):', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
