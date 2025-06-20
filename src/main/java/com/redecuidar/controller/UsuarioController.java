package com.redecuidar.controller;

import com.redecuidar.dto.UsuarioDTO;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.UsuarioRepository;
import com.redecuidar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

