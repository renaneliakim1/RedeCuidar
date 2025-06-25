package com.redecuidar.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

@Component
public class EnvConfig {

    private final Dotenv dotenv;

    public EnvConfig() {
        this.dotenv = Dotenv.load();
    }

    public String getRecaptchaSecret() {
        return dotenv.get("RECAPTCHA_SECRET");
    }
}
