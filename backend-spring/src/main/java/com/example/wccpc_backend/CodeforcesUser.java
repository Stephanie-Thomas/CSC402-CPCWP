package com.example.wccpc_backend;

public class CodeforcesUser {
    private String username;
    private Integer rating;
    private String rank;


    // Constructors
    public CodeforcesUser() {

    }

    public CodeforcesUser(String username, Integer rating, String rank) {
        this.username = username;
        this.rating = rating;
        this.rank = rank;
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

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

}