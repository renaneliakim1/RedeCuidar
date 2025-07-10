package com.redecuidar.controller;

import com.redecuidar.config.EnvConfig;
import com.redecuidar.config.RecaptchaResponse;
import com.redecuidar.dto.LoginDto;
import com.redecuidar.dto.NovaSenhaDTO;
import com.redecuidar.dto.TokenDTO;
import com.redecuidar.model.ResetToken;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.ResetTokenRepository;
import com.redecuidar.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletRequest;


import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {

    private final String recaptchaSecret;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private ResetTokenRepository tokenRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          EnvConfig envConfig) {
        this.recaptchaSecret = envConfig.getRecaptchaSecret();
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto, HttpServletRequest request) {
        if (!validateCaptcha(dto.getCaptchaToken())) {
            return ResponseEntity.badRequest().body("Falha na verificação do reCAPTCHA");
        }

       /* try {
            request.login(dto.getEmail(), dto.getSenha()); // <<< ESSENCIAL

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
            return usuarioOpt
                    .map(usuario -> ResponseEntity.ok(usuario.getNome()))
                    .orElseGet(() -> ResponseEntity.status(404).body("Usuário não encontrado"));

        } catch (ServletException e) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }*/
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Cria e salva o contexto na sessão manualmente
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());


            Usuario usuario = usuarioRepository.findByEmail(dto.getEmail()).orElseThrow();

            return ResponseEntity.ok(usuario.getNome());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }


    // ✅ REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Registro realizado!");
    }

    // ✅ VERIFICAÇÃO DE reCAPTCHA
    private boolean validateCaptcha(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            URI uri = new URI("https://www.google.com/recaptcha/api/siteverify");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "secret=" + recaptchaSecret + "&response=" + token;
            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<RecaptchaResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.POST,
                    request,
                    RecaptchaResponse.class
            );

            return response.getBody() != null && response.getBody().isSuccess();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // ✅ SALVAR TOKEN DE REDEFINIÇÃO DE SENHA
    @PostMapping("/salvar-token")
    public String salvarToken(@RequestBody TokenDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
        if (usuarioOpt.isEmpty()) {
            return "Usuário não encontrado.";
        }

        ResetToken token = new ResetToken();
        token.setEmail(dto.getEmail());
        token.setToken(dto.getToken());
        token.setValidade(LocalDateTime.now().plusMinutes(30));

        tokenRepository.save(token);
        return "Token salvo.";
    }

    // ✅ REDEFINIR SENHA
    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody NovaSenhaDTO dto) {
        Optional<ResetToken> optionalToken = tokenRepository.findByToken(dto.getToken());

        if (optionalToken.isEmpty()) {
            return ResponseEntity.status(400).body("Token inválido");
        }

        ResetToken token = optionalToken.get();

        if (token.getValidade().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Token expirado");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(token.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);
        tokenRepository.delete(token);

        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }
}
