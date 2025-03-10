package com.example.wccpc_backend;

public class LeetcodeUser {
    private String username;
    private Integer totalSolved;
    private String ranking;
    private String contestRanking;
    private String contestTitle;

    // Constructors
    public LeetcodeUser() {}
    public LeetcodeUser(String username, Integer totalSolved, String ranking, String contestRanking, String contestTitle) {
        this.username = username;
        this.totalSolved = totalSolved;
        this.ranking = ranking;
        this.contestRanking = contestRanking;
        this.contestTitle = contestTitle;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Integer getTotalSolved() { return totalSolved; }
    public void setTotalSolved(Integer totalSolved) { this.totalSolved = totalSolved; }
    public String getRanking() { return ranking; }
    public void setRanking(String ranking) { this.ranking = ranking; }
    public String getContestRanking() { return contestRanking; }
    public void setContestRanking(String contestRanking) { this.contestRanking = contestRanking; }
    public String getContestTitle() { return contestTitle; }
    public void setContestTitle(String contestTitle) { this.contestTitle = contestTitle; }
}
