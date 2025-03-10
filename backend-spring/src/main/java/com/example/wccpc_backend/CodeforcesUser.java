package com.example.wccpc_backend;

public class CodeforcesUser {
    private String username;
    private Integer rating;
    private Integer maxRating;
    private String rank;
    private String maxRank;

    // Constructors
    public CodeforcesUser() {

    }

    public CodeforcesUser(String username, Integer rating, Integer maxRating, String rank, String maxRank) {
        this.username = username;
        this.rating = rating;
        this.maxRating = maxRating;
        this.rank = rank;
        this.maxRank = maxRank;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getMaxRank() {
        return maxRank;
    }

    public void setMaxRank(String maxRank) {
        this.maxRank = maxRank;
    }

}