package com.redecuidar.service;

import com.redecuidar.dto.AuthRequest;
import com.redecuidar.dto.AuthResponse;


import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse autenticar(AuthRequest request) {
        // Autentica o usuário (verifica email e senha)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        // Busca o usuário no banco
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // Gera o token JWT
        String token = jwtService.generateToken(usuario.getEmail());

        // Retorna o token no corpo da resposta
        return new AuthResponse(token);
    }
}
