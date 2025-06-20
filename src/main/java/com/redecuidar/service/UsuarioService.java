package com.redecuidar.service;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    public Usuario criarUsuarioComFoto(UsuarioDTO usuarioDTO, MultipartFile foto) {
        Usuario usuario = usuarioDTO.toUsuario();
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        if (foto != null && !foto.isEmpty()) {
            try {
                String nomeArquivo = UUID.randomUUID() + "_" + foto.getOriginalFilename();
                Path caminho = Paths.get("uploads/fotos-perfil", nomeArquivo);
                Files.createDirectories(caminho.getParent());
                Files.copy(foto.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);
                usuario.setFotoPerfil(nomeArquivo);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar a foto de perfil", e);
            }
        }

        return usuarioRepository.save(usuario);
    }

}