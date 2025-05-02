# Render Deployment Documentation
**WCU Competitive Programming Club – Leaderboard Project**

This project is deployed on [Render.com](https://render.com) using four services:

| Service Name       | Type         | GitHub Repo                                   |
|--------------------|--------------|-----------------------------------------------|
| Frontend           | Static Site  | https://github.com/Stephanie-Thomas/CSC402-CPCWP |
| Backend (Node)     | Docker       | https://github.com/Stephanie-Thomas/CSC402-CPCWP |
| LeetCode API       | Node Service | https://github.com/tobibussiek/leetcode-api     |
| Redis              | Internal     | Managed by Render (used for leaderboard caching) |

---

## 1. Frontend (Static Site)

- Directory: `frontend`
- Publish Directory: `dist/public`
- Build Command:
  ```
  npm install && npm run build
  ```
- Environment Variables:
  ```
  VITE_API_BASE_URL=https://dockerbackendtest.onrender.com/
  ```

The frontend connects to the backend via the above API URL. It displays user stats, news, team info, and leaderboard data.

---

## 2. Backend (`DockerBackendTest`)

- Directory: `backend-node`
- Dockerfile used: `backend-node/Dockerfile.prod`
- Deployed Branch: `DockerHostingTest`
- Autodeploy from GitHub: Enabled, but not currently working automatically (manual deploys required)
- Environment Variables:
  ```
  MONGO_URI=mongodb+srv://dbUser:gocsrams@leaderboarddb.e36lq.mongodb.net/WCU_Leaderboard?retryWrites=true&w=majority&appName=LeaderboardDB
  leaderboard-redis=redis://red-cve8c9jqf0us738g0q2g:6379
  ```

The backend stores registered users in MongoDB and retrieves contest data from the LeetCode API and Codeforces.

---

## 3. LeetCode API (`wculeetcode-api`)

- GitHub Repo: https://github.com/tobibussiek/leetcode-api
- Build Command:
  ```
  npm install
  ```
- Start Command:
  ```
  npm run dev
  ```
- Rate Limiting Configuration:
  You **must add** the following line inside `src/app.ts` after initializing Express:
  ```ts
  app.set('trust proxy', true);
  ```

This service acts as a wrapper around the (unofficial) Alfa LeetCode API and exposes cleaned-up endpoints like:

- `/userProfile/:username`
- `/userContestRankingInfo/:username`
- `/userProfileCalendar?username=...`
- `/userProfileUserQuestionProgressV2/:userSlug`

---

## 4. Redis (Render-managed)

- Redis is used for caching leaderboard results to reduce API calls
- URL: `redis://red-cve8c9jqf0us738g0q2g:6379`
- It is configured in the backend using the `leaderboard-redis` environment variable

---

## Inter-Service Communication

- The backend fetches contest data from the **LeetCode API** using the public URL:
  ```
  https://wculeetcode-api.onrender.com
  ```
- MongoDB Atlas is used for user registration persistence
- Redis is used to cache leaderboard responses for 2 minutes

---

Access Credentials to Email and Render Login are provided separately  


# MongoDB Atlas Documentation


The project uses MongoDB Atlas as a cloud database to persist registered user information.
1. Cluster Information

    Cluster URL:

    mongodb+srv://dbUser:gocsrams@leaderboarddb.e36lq.mongodb.net/WCU_Leaderboard?retryWrites=true&w=majority&appName=LeaderboardDB

    Database Name: WCU_Leaderboard

    Primary Collection: users

2. Stored Data

Each document in the users collection contains:

{
  "name": "John Doe",
  "email": "jdoe@wcupa.edu",
  "leetcodeUsername": "johndoe",
  "codeforcesUsername": "johndoe_cf"
}

The frontend registration form submits this data. The backend checks for unique emails and allows users to register with either a LeetCode or Codeforces username (or both).
3. MongoDB Atlas Access

To log in and manage the database:

    URL: https://cloud.mongodb.com

    Credentials are provided separately in the team password manager or secure document.

Once logged in:

    Navigate to Clusters > LeaderboardDB

    Click Data Explorer to view or edit user data

    Use Database Access section to manage user credentials or roles if needed

4. Backend Configuration

In Render, the backend uses this connection string via an environment variable:

MONGO_URI=mongodb+srv://dbUser:gocsrams@leaderboarddb.e36lq.mongodb.net/WCU_Leaderboard?retryWrites=true&w=majority&appName=LeaderboardDB

This is injected at runtime and used to connect using Mongoose.