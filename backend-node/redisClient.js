// backend-node/redisClient.js
const redis = require("redis");
require("dotenv").config(); // Make sure env vars are loaded

// Use standardized env var name
const redisUrl = process.env.REDIS_URL || process.env['leaderboard-redis'];

if (!redisUrl) {
  throw new Error('Redis URL environment variable is not set.');
}

const redisClient = redis.createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connection established");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = redisClient;
