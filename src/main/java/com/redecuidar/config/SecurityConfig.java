package com.redecuidar.config;

import com.redecuidar.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager necessário para autenticação manual no AuthController
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Segurança geral da API
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Desativado para permitir chamadas POST externas (fetch/axios)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers("/api/auth/login", "/api/auth/registro", "/api/auth/salvar-token", "/api/auth/redefinir-senha").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        /* .requestMatchers("/usuarios/**").permitAll()*/
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                        .requestMatchers("/api/auth/salvar-token", "/api/auth/redefinir-senha", "/api/auth/login").permitAll()

                        .requestMatchers("/uploads/fotos-perfil/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/avaliacoes").authenticated()


                        // Protegidos (exemplo: POST em avaliações)
                        .requestMatchers(HttpMethod.POST, "/avaliacoes").authenticated()

                        // Tudo mais exige autenticação
                        .anyRequest().authenticated()
                )


                // Logout customizado (opcional)
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                        })
                )

                // Tratamento de erros
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> res.setStatus(HttpStatus.UNAUTHORIZED.value()))
                );

        return http.build();
    }

    // Configuração de CORS para permitir comunicação com o frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        config.setAllowCredentials(true); // Importante se você usa `credentials: 'include'` no frontend
        config.setMaxAge(3600L); // 1h

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
