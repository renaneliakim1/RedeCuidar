package com.redecuidar.controller;

import com.redecuidar.dto.UpdateUsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET - Listar todos os usuários
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    // GET - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }

    // POST - Cadastro de novo usuário
    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody Usuario usuario) {
        Usuario novo = usuarioService.cadastrar(usuario);
        if (novo == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Email já existe
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    // PUT - Atualizar perfil do próprio usuário
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UpdateUsuarioDTO dto,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
        }

        String emailLogado = authentication.getName();
        return usuarioService.atualizarUsuario(id, dto, emailLogado);
    }

    // DELETE - Excluir a própria conta
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
        }

        String emailLogado = authentication.getName();
        return usuarioService.excluirConta(id, emailLogado);
    }
}
