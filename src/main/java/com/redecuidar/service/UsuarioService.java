package com.redecuidar.service;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /*@Autowired
    private PasswordEncoder passwordEncoder;*/

    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UsuarioService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }



    public Usuario criarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioDTO.toUsuario();
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario atualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    Usuario usuario = usuarioDTO.toUsuario();
                    usuario.setId(id);
                    usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void deletarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> listarPrestadoresServico() {
        return usuarioRepository.findByOfereceServicoTrue();
    }

    public List<Usuario> listarPrestadoresPorEspecialidade(Usuario.Especialidade especialidade) {
        return usuarioRepository.findByOfereceServicoTrueAndEspecialidade(especialidade);
    }
}