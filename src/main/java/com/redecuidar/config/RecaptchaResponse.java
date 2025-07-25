package com.redecuidar.config;

public class RecaptchaResponse {
    private boolean success;
    private String challenge_ts;
    private String hostname;
    private float score;
    private String action;

    // Getters e Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getChallenge_ts() { return challenge_ts; }
    public void setChallenge_ts(String challenge_ts) { this.challenge_ts = challenge_ts; }
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public float getScore() { return score; }
    public void setScore(float score) { this.score = score; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
