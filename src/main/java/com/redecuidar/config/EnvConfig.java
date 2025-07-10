package com.redecuidar.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    private final Dotenv dotenv = Dotenv.load();

    public String getRecaptchaSecret() {
        return dotenv.get("RECAPTCHA_SECRET");
    }
}
