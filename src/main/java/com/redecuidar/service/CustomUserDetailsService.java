package com.redecuidar.service;

import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

       /* @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 Procurando usuário com email: " + email);

        Usuario usuario = usuarioRepository.findByEmail(email.trim().toLowerCase()) // remove espaços
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));


        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(new ArrayList<>()) // ou role
                .build();
    }*/

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 Procurando usuário com email: " + email);

        Usuario usuario = usuarioRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return usuario; // ✅ Agora com roles de acordo com o email
    }

}
