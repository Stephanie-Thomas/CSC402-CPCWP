import type { Express } from "express";
import { createServer, type Server } from "http";

// Static data for the leaderboards
const codeforcesUsers = [
  { handle: "ap0209", rating: 1500, rank: "specialist" },
  { handle: "marybauman", rating: 1600, rank: "expert" },
  { handle: "parmort", rating: 1400, rank: "pupil" },
  { handle: "bwc9876", rating: 1700, rank: "expert" },
  { handle: "noah_lot", rating: 1450, rank: "specialist" }
];

const leetcodeUsers = [
  { username: "kmatotek", totalSolved: 150, overallRanking: "10000", contestRanking: "5000", contestTitle: "Weekly Contest 388" },
  { username: "linhbngo", totalSolved: 200, overallRanking: "8000", contestRanking: "4500", contestTitle: "Weekly Contest 388" },
  { username: "bwc9876", totalSolved: 175, overallRanking: "9000", contestRanking: "4800", contestTitle: "Weekly Contest 388" }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Codeforces leaderboard endpoint
  app.get("/api/codeforces-leaderboard", (_req, res) => {
    try {
      res.json(codeforcesUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Codeforces leaderboard" });
    }
  });

  // LeetCode leaderboard endpoint
  app.get("/api/leetcode-leaderboard", (_req, res) => {
    try {
      res.json(leetcodeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch LeetCode leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}