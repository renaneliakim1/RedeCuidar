package com.redecuidar.dto;

public class LoginDto {
    private String email;
    private String senha;

    // Construtor padrão
    public LoginDto() {
    }

    // Construtor com campos
    public LoginDto(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    // Getters e Setters
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

    // Método toString (opcional, mas útil para logging)
    @Override
    public String toString() {
        return "LoginDto{" +
                "email='" + email + '\'' +
                ", senha='[PROTECTED]'" +
                '}';
    }
}