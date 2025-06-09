package com.redecuidar.controller;

import com.redecuidar.dto.AuthRequest;
import com.redecuidar.dto.AuthResponse;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import com.redecuidar.service.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Autentica o usuário com email e senha
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
            );

            // Gera o token JWT com base na autenticação
            String email = authentication.getName(); // isso pega o email do usuário autenticado
            String token = jwtService.generateToken(email);


            // Retorna o token no corpo da resposta
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Email ou senha inválidos.");
        }
    }
}
