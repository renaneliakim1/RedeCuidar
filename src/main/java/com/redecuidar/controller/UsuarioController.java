package com.redecuidar.controller;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import com.redecuidar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")//@CrossOrigin(originPatterns = "http://localhost:5173") ou "
public class UsuarioController {

    private final UsuarioService usuarioService;
    private UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
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

/*    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario atualizado = usuarioService.atualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(atualizado);
    }*/

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuarioAtualizado) {

        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Atualize os campos que quiser, exemplo:
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setTelefone(usuarioAtualizado.getTelefone());
                    usuario.setEndereco(usuarioAtualizado.getEndereco());
                    usuario.setEspecialidade(usuarioAtualizado.getEspecialidade());
                    usuario.setDescricaoServico(usuarioAtualizado.getDescricaoServico());
                    usuario.setOfereceServico(usuarioAtualizado.isOfereceServico());
                    // lembre-se de atualizar a senha só se quiser (ou ignore)

                    Usuario atualizado = usuarioRepository.save(usuario);
                    return ResponseEntity.ok(atualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
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


    /*@GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }*/

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

