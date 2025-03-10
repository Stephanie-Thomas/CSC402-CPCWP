package com.example.wccpc_backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
public class LeaderboardController {

    private static final Logger logger = LoggerFactory.getLogger(LeaderboardController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/api/codeforces-leaderboard")
    public ResponseEntity<?> getCodeforcesLeaderboard() {
        String cacheKey = "Codeforcesleaderboard";

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                logger.info("Returning cached Codeforces leaderboard data from Redis");
                List<CodeforcesUser> leaderboard = objectMapper.readValue(cachedData, objectMapper.getTypeFactory().constructCollectionType(List.class, CodeforcesUser.class));
                return ResponseEntity.ok(leaderboard);
            }
        } catch (Exception e) {
            logger.error("Error accessing Redis cache: ", e);
        }

        try {
            List<String> users = Arrays.asList("tourist", "Petr", "Benq", "Radewoosh", "mnbvmar", "hello");
            List<CodeforcesUser> leaderboard = users.stream().map(user -> {
                String url = "https://codeforces.com/api/user.info?handles=" + user;
                JsonNode response = restTemplate.getForObject(url, JsonNode.class);
                JsonNode userData = response.get("result").get(0);
                return new CodeforcesUser(
                        userData.get("handle").asText(),
                        userData.get("rating").isNull() ? null : userData.get("rating").asInt(),
                        userData.get("maxRating").isNull() ? null : userData.get("maxRating").asInt(),
                        userData.get("rank").isNull() ? "N/A" : userData.get("rank").asText(),
                        userData.get("maxRank").isNull() ? "N/A" : userData.get("maxRank").asText()
                );
            }).collect(Collectors.toList());

            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(leaderboard), 300, TimeUnit.SECONDS);
            logger.info("Codeforces leaderboard data cached in Redis");
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            logger.error("Error fetching Codeforces leaderboard: ", e);
            return ResponseEntity.status(500).body("Failed to fetch leaderboard data");
        }
    }

    @GetMapping("/api/leetcode-leaderboard")
    public ResponseEntity<?> getLeetcodeLeaderboard() {
        String cacheKey = "leetcodeLeaderboard";

        try {
            String cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                logger.info("Returning cached LeetCode leaderboard data from Redis");
                List<LeetcodeUser> leaderboard = objectMapper.readValue(cachedData, objectMapper.getTypeFactory().constructCollectionType(List.class, LeetcodeUser.class));
                return ResponseEntity.ok(leaderboard);
            }
        } catch (Exception e) {
            logger.error("Error accessing Redis cache: ", e);
        }

        try {
            List<String> users = Arrays.asList("kmatotek", "vVa3haPhIY", "Kaushal_Aknurwar", "Junglee_Coder");
            List<LeetcodeUser> leaderboard = users.stream().map(username -> {
                try {
                    String profileUrl = "http://leetcode_api:3000/userProfile/" + username;
                    String contestUrl = "http://leetcode_api:3000/userContestRankingInfo/" + username;
                    JsonNode profileResponse = restTemplate.getForObject(profileUrl, JsonNode.class);
                    JsonNode contestResponse = restTemplate.getForObject(contestUrl, JsonNode.class);

                    JsonNode history = contestResponse.get("data").get("userContestRankingHistory");
                    String contestRanking = "N/A";
                    String contestTitle = null;
                    if (history != null && history.isArray() && history.size() > 0) {
                        JsonNode lastContest = history.get(history.size() - 1);
                        contestRanking = lastContest.get("ranking").isNull() ? "N/A" : lastContest.get("ranking").asText();
                        contestTitle = lastContest.get("contest").get("title").isNull() ? null : lastContest.get("contest").get("title").asText();
                    }

                    return new LeetcodeUser(
                            username,
                            profileResponse.get("totalSolved").isNull() ? 0 : profileResponse.get("totalSolved").asInt(),
                            profileResponse.get("ranking").isNull() ? "N/A" : profileResponse.get("ranking").asText(),
                            contestRanking,
                            contestTitle
                    );
                } catch (Exception e) {
                    logger.error("Error fetching data for " + username + " from leetcode_api: ", e);
                    return new LeetcodeUser(username, 0, "N/A", "N/A", null);
                }
            }).sorted((a, b) -> {
                String rankA = a.getContestRanking();
                String rankB = b.getContestRanking();
                if ("N/A".equals(rankA)) return 1;
                if ("N/A".equals(rankB)) return -1;
                return Integer.compare(Integer.parseInt(rankA), Integer.parseInt(rankB));
            }).collect(Collectors.toList());

            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(leaderboard), 300, TimeUnit.SECONDS);
            logger.info("LeetCode leaderboard data (with contest ranking) cached in Redis");
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            logger.error("Error fetching LeetCode leaderboard from leetcode_api: ", e);
            return ResponseEntity.status(500).body("Failed to fetch LeetCode leaderboard data");
        }
    }
}
