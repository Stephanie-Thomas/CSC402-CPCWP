# External API Documentation

This documentation explains where we are getting our LeetCode and Codeforces data from. Our implementation leverages an open-sourced project on GitHub, [alfaarghya/alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api), to fetch all LeetCode stats and uses [Codeforces official API](https://codeforces.com/apiHelp) for all of the Codeforces stats.

## LeetCode API

Some of the data we utilize from the LeetCode open source project are:
- **User Profile:** Detailed statistics and profile information for a given LeetCode username.
- **Contest Ranking Information:** Data on contest performance and rankings.

## Codeforces API

Our backend also leverages the Codeforces API to fetch user information needed for the leaderboard. In our implementation, we use the following endpoint:
- **User Info Endpoint:** `https://codeforces.com/api/user.info?handles=<comma-separated-handles>`  
  This endpoint retrieves detailed information (e.g., rating, rank) for the specified Codeforces users.

For more details about the available endpoints and their usage, please refer to the [Codeforces API Help](https://codeforces.com/apiHelp).

## Notes
- Our implementation is powered by [alfaarghya/alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api), which handles data fetching and formatting from LeetCode.
- If you want to see the source code, or see their full documentation to test all endpoints yourself, visit their repository on GitHub.

