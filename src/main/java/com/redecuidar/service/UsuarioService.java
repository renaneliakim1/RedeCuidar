package com.redecuidar.service;

import com.redecuidar.dto.UpdateUsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos os usuários
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Buscar usuário por ID — usando Optional corretamente
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // Cadastrar novo usuário
    public Usuario cadastrar(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());
        if (existente.isPresent()) {
            return null; // E-mail já cadastrado
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    // Atualizar o próprio perfil
    public ResponseEntity<?> atualizarUsuario(Long id, UpdateUsuarioDTO dto, String emailAutenticado) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isEmpty()) {
            return null;
        }

        Usuario usuario = optionalUsuario.get();

        if (!usuario.getEmail().equals(emailAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Ação não permitida.");
        }

        // Atualiza apenas os campos informados
        if (dto.getNome() != null) usuario.setNome(dto.getNome());
        if (dto.getEmail() != null) usuario.setEmail(dto.getEmail());
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        if (dto.getTelefone() != null) usuario.setTelefone(dto.getTelefone());
        if (dto.getFoto() != null) usuario.setFoto(dto.getFoto());
        if (dto.getEndereco() != null) usuario.setEndereco(dto.getEndereco());

        usuario.setOfereceServicos(dto.isOfereceServicos());
        usuario.setEspecialidades(dto.getEspecialidades());
        usuario.setDescricao(dto.getDescricao());
        usuario.setExperiencia(dto.getExperiencia());

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário atualizado com sucesso.");
    }

    // Excluir o próprio perfil
    public ResponseEntity<?> excluirConta(Long id, String emailAutenticado) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        Usuario usuario = optionalUsuario.get();

        if (!usuario.getEmail().equals(emailAutenticado)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você só pode excluir sua própria conta.");
        }

        usuarioRepository.delete(usuario);
        return ResponseEntity.ok("Usuário excluído com sucesso.");
    }
}
