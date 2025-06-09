package com.redecuidar.dto;

public class AuthResponse {
    private String token;

    public AuthResponse() {
        // Construtor padrão
    }

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    // Remover o setter para manter imutabilidade:
    // public void setToken(String token) {
    //    this.token = token;
    // }
}
