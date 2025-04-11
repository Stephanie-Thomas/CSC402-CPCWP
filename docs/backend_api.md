
# Backend API Documentation

This documentation explains how to test and use the backend API endpoints during development. You can use Postman (or any HTTP client) to send requests and inspect the responses. The API is built using Express, leverages Redis caching, and connects to external services (Codeforces and LeetCode). We reccomend running `docker compose up --build` to build the application so you can test these endpoints. 🚀

## Recommended Prerequisites
- Postman for testing API endpoints: [Postman](https://www.postman.com/downloads/)
- Redis Insight for viewing the cached leaderboard data: [Redis Insight](https://redis.io/docs/latest/operate/redisinsight/install/)

## Testing the API with Postman

### 1. Codeforces Leaderboard Endpoint
- **Method:** GET  
- **URL:** `/api/codeforces-leaderboard`  
- **Description:**  
  Retrieves a leaderboard of Codeforces users by first checking Redis cache; if not cached, fetches data from the Codeforces API, caches it for 15 minutes, and returns the leaderboard.
- **Test with Postman:**  
  Send a GET request to `http://localhost:4000/api/codeforces-leaderboard` and verify that the response is a JSON array containing objects with keys like `handle`, `rating`, and `rank`. 

### 2. Leetcode Leaderboard Endpoint
- **Method:** GET  
- **URL:** `/api/leetcode-leaderboard`  
- **Description:**  
  Retrieves a LeetCode leaderboard by obtaining user profiles and contest data from a secondary API, caches the result in Redis for 15 minutes, and returns the leaderboard with details like `totalSolved`, `overallRanking`, `contestRanking`, and `contestTitle`.
- **Test with Postman:**  
  Send a GET request to `http://localhost:4000/api/leetcode-leaderboard` and confirm that the JSON response has the expected leaderboard structure.

### 3. User Registration Endpoint
- **Method:** POST  
- **URL:** `/api/register`  
- **Description:**  
  Registers a new user. Expects a JSON payload with the fields: `name`, `email`, `leetcodeUsername`, and `codeforcesUsername`. The endpoint validates required fields and checks for unique email addresses.
- **Test with Postman:**  
  - Set the request type to POST and URL to `http://localhost:4000/api/register`.
  - In the Body, select raw JSON and use a payload such as:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "leetcodeUsername": "john_doe",
      "codeforcesUsername": "john_doe_cf"
    }
    ```
  - Send the request and expect a 201 status code with a success message if the registration is successful. 🔐

## Viewing Cached Data in Redis

- **Redis Caching:**  
  The API uses Redis to cache leaderboard data (e.g., keys like `Codeforcesleaderboard` and `leetcodeLeaderboard`). Look for console logs (e.g., "Returning cached...") to confirm that caching is active.

- **Accessing Cache with Redis Insight:**  
  Use Redis Insight to view the cached leaderboard data. Connect to your Redis instance at `localhost` on port **6369**. Once connected, you can browse the keys and inspect their values to see the cached leaderboard information. 

## Additional Notes

- **Error Handling:**  
  The endpoints include error handling. You can test invalid inputs (e.g., missing fields in registration) to see how error responses are handled.

Happy testing with Postman! 🚀
