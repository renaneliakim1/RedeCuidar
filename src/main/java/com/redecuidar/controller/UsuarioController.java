package com.redecuidar.controller;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import com.redecuidar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;



    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Usuario> criarUsuario(
            @RequestPart("usuario") UsuarioDTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        Usuario usuario = usuarioService.criarUsuarioComFoto(usuarioDTO, foto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Long id) {
        return usuarioService.buscarUsuarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Usuario> atualizarUsuario(
            @PathVariable Long id,
            @RequestPart("usuario") UsuarioDTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            Usuario usuarioAtualizado = usuarioService.atualizarUsuarioComFoto(id, usuarioDTO, foto);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

/*    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }*/


    // Exemplo de controlador
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String senhaAdmin = body.get("adminPassword");
        // buscar usuário admin no banco (ex: pelo email 'admin@redecuidar.com')
        Usuario admin = usuarioRepository.findByEmail("admin@redecuidar.com").orElse(null);
        if (admin == null || !passwordEncoder.matches(senhaAdmin, admin.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha do administrador inválida");
        }

        // não permitir deletar admin
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        if ("admin@redecuidar.com".equalsIgnoreCase(usuario.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Não é permitido excluir o administrador");
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok("Usuário excluído com sucesso");
    }


    @GetMapping("/prestadores")
    public ResponseEntity<List<Usuario>> listarPrestadoresServico() {
        List<Usuario> prestadores = usuarioService.listarPrestadoresServico();
        return ResponseEntity.ok(prestadores);
    }

    @GetMapping("/prestadores/{especialidade}")
    public ResponseEntity<List<Usuario>> listarPrestadoresPorEspecialidade(@PathVariable Usuario.Especialidade especialidade) {
        List<Usuario> prestadores = usuarioService.listarPrestadoresPorEspecialidade(especialidade);
        return ResponseEntity.ok(prestadores);
    }

    @GetMapping("/perfil")
    public ResponseEntity<Usuario> buscarPorEmail(@RequestParam String email) {
        return usuarioRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/oferecendo-servicos")
    public List<Usuario> listarQuemOfereceServicos() {
        return usuarioRepository.findByOfereceServicoTrue();
    }
}
