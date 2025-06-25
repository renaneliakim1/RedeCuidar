package com.redecuidar.controller;

import com.redecuidar.config.EnvConfig;
import com.redecuidar.config.RecaptchaResponse;
import com.redecuidar.dto.LoginDto;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final String recaptchaSecret;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          EnvConfig envConfig) { // injeta o componente
        this.recaptchaSecret = envConfig.getRecaptchaSecret();
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,
                                   @RequestParam String senha,
                                   @RequestParam("captchaToken") String captchaToken) {
        if (!validateCaptcha(captchaToken)) {
            return ResponseEntity.badRequest().body("Falha na verificação do reCAPTCHA");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, senha)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
            return usuarioOpt.map(usuario -> ResponseEntity.ok(usuario.getNome()))
                    .orElseGet(() -> ResponseEntity.status(404).body("Usuário não encontrado"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Registro realizado!");
    }

    private boolean validateCaptcha(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", recaptchaSecret);
        params.add("response", token);

        RecaptchaResponse response = restTemplate.postForObject(url, params, RecaptchaResponse.class);

        return response != null && response.isSuccess();
    }
}
