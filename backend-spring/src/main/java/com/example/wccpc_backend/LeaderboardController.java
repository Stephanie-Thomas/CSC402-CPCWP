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

import java.util.*;
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
                List<CodeforcesUser> leaderboard = objectMapper.readValue(cachedData, 
                        objectMapper.getTypeFactory().constructCollectionType(List.class, CodeforcesUser.class));
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
                List<LeetcodeUser> leaderboard = objectMapper.readValue(cachedData, 
                        objectMapper.getTypeFactory().constructCollectionType(List.class, LeetcodeUser.class));
                return ResponseEntity.ok(leaderboard);
            }
        } catch (Exception e) {
            logger.error("Error accessing Redis cache: ", e);
        }

        try {
            List<String> users = Arrays.asList("kmatotek", "jetacop384");
            Map<String, JsonNode> profileDataMap = new HashMap<>();
            Map<String, JsonNode> contestHistoryMap = new HashMap<>();

            // Fetch profile and contest data for all users
            for (String username : users) {
                String profileUrl = "http://leetcode_api:3000/userProfile/" + username;
                String contestUrl = "http://leetcode_api:3000/userContestRankingInfo/" + username;
                JsonNode profileResponse = restTemplate.getForObject(profileUrl, JsonNode.class);
                JsonNode contestResponse = restTemplate.getForObject(contestUrl, JsonNode.class);
                profileDataMap.put(username, profileResponse);
                contestHistoryMap.put(username, contestResponse.get("data").get("userContestRankingHistory"));
            }

            // Determine the global most recent contest (based on startTime) 
            // among all contest entries where ranking != "N/A" and ranking != "0".
            Long globalLatestStartTime = null;
            for (Map.Entry<String, JsonNode> entry : contestHistoryMap.entrySet()) {
                JsonNode history = entry.getValue();
                if (history != null && history.isArray()) {
                    for (JsonNode contestEntry : history) {
                        String rankingText = contestEntry.get("ranking").isNull() ? "N/A" : contestEntry.get("ranking").asText();
                        // Only consider contest entries with a valid ranking (non-zero and not "N/A")
                        if (!"N/A".equals(rankingText) && !"0".equals(rankingText)) {
                            JsonNode contestObj = contestEntry.get("contest");
                            if (contestObj != null && contestObj.has("startTime") && !contestObj.get("startTime").isNull()) {
                                long startTime = contestObj.get("startTime").asLong();
                                if (globalLatestStartTime == null || startTime > globalLatestStartTime) {
                                    globalLatestStartTime = startTime;
                                }
                            }
                        }
                    }
                }
            }

            // Build leaderboard using the global contest stats.
            // For each user, if they participated in the global contest, use that contest's ranking and title.
            // Otherwise, set contest ranking as "N/A" and contest title as null.
            List<LeetcodeUser> leaderboard = new ArrayList<>();
            for (String username : users) {
                JsonNode profileResponse = profileDataMap.get(username);
                int totalSolved = (profileResponse.get("totalSolved").isNull()) ? 0 : profileResponse.get("totalSolved").asInt();
                String overallRanking = profileResponse.get("ranking").isNull() ? "N/A" : profileResponse.get("ranking").asText();

                String contestRanking = "N/A";
                String contestTitle = null;
                JsonNode history = contestHistoryMap.get(username);
                if (globalLatestStartTime != null && history != null && history.isArray()) {
                    for (JsonNode contestEntry : history) {
                        JsonNode contestObj = contestEntry.get("contest");
                        if (contestObj != null && contestObj.has("startTime") && !contestObj.get("startTime").isNull()) {
                            long startTime = contestObj.get("startTime").asLong();
                            // Check if this contest is the global most recent contest.
                            if (startTime == globalLatestStartTime) {
                                contestRanking = contestEntry.get("ranking").isNull() ? "N/A" : contestEntry.get("ranking").asText();
                                contestTitle = contestObj.get("title").isNull() ? null : contestObj.get("title").asText();
                                break;
                            }
                        }
                    }
                }

                leaderboard.add(new LeetcodeUser(username, totalSolved, overallRanking, contestRanking, contestTitle));
            }

            // Sort leaderboard: users with a valid contest ranking (lowest number first) come before those with "N/A".
            leaderboard.sort((a, b) -> {
                if ("N/A".equals(a.getContestRanking())) return 1;
                if ("N/A".equals(b.getContestRanking())) return -1;
                return Integer.compare(Integer.parseInt(a.getContestRanking()), Integer.parseInt(b.getContestRanking()));
            });

            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(leaderboard), 300, TimeUnit.SECONDS);
            logger.info("LeetCode leaderboard data (with global contest ranking) cached in Redis");
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            logger.error("Error fetching LeetCode leaderboard from leetcode_api: ", e);
            return ResponseEntity.status(500).body("Failed to fetch LeetCode leaderboard data");
        }
    }
}
