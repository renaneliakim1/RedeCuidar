package com.redecuidar.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Caminho da pasta no sistema de arquivos
        Path uploadDir = Paths.get("uploads/fotos-perfil");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Mapeia a URL /uploads/fotos-perfil/** para os arquivos da pasta
        registry.addResourceHandler("/uploads/fotos-perfil/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
