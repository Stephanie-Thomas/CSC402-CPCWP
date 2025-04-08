const express = require('express');
const axios = require('axios');
const redisClient = require('../redisClient');
const User = require('../models/userModel');


const router = express.Router();

// Codeforces leaderboard endpoint
router.get('/codeforces-leaderboard', async (req, res) => {
    const cacheKey = 'Codeforcesleaderboard';

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Returning cached Codeforces leaderboard data from Redis');
            return res.json(JSON.parse(cachedData));
        }
    } catch (error) {
        console.error('Error accessing Redis cache:', error);
    }

    try {
        const users = ["ap0209", "marybauman", "parmort", "bwc9876", "noah_lot", "cc976948"];
        const leaderboard = [];

        for (const user of users) {
            try {
                const response = await axios.get(`https://codeforces.com/api/user.info?handles=${user}`);
                
                if (!response.data || 
                    response.data.status !== 'OK' ||
                    !response.data.result ||
                    !Array.isArray(response.data.result) ||
                    response.data.result.length === 0) {
                    leaderboard.push({ handle: user, rating: null, rank: 'N/A' });
                    continue;
                }

                const userData = response.data.result[0];
                leaderboard.push({
                    handle: userData.handle || user,
                    rating: userData.rating || null,
                    rank: userData.rank || 'N/A'
                });
            } catch (error) {
                console.error(`Error processing user ${user}:`, error.message);
                leaderboard.push({ handle: user, rating: null, rank: 'N/A' });
            }
        }

        await redisClient.setEx(cacheKey, 900, JSON.stringify(leaderboard));
        console.log('Codeforces leaderboard data cached in Redis');
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching Codeforces leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
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
        const users = ["kmatotek", "linhbngo"];
        const profileDataMap = new Map();
        const contestHistoryMap = new Map();

        // Fetch profile and contest data
        for (const username of users) {
            try {
                const [profileResponse, contestResponse] = await Promise.all([
                    axios.get(`http://leetcode_api:3000/userProfile/${username}`),
                    axios.get(`http://leetcode_api:3000/userContestRankingInfo/${username}`)
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, leetcodeUsername, codeforcesUsername } = req.body;

    // Check for required fields
    if (!name || !email || !leetcodeUsername || !codeforcesUsername) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      leetcodeUsername,
      codeforcesUsername
    });

    await newUser.save();
    return res.status(201).json({ message: "Successfully registered." });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;