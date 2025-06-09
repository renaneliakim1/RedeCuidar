package com.redecuidar.dto;

public class AuthRequest {
    private String email;
    private String senha;

    public AuthRequest() {
        // Construtor padrão necessário para desserialização JSON
    }

    public AuthRequest(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
