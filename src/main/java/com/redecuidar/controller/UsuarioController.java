package com.redecuidar.controller;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")//@CrossOrigin(originPatterns = "http://localhost:5173") ou "
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.criarUsuario(usuarioDTO);
        return ResponseEntity.ok(usuario);
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

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario atualizado = usuarioService.atualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
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
}

