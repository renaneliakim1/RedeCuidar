package com.redecuidar.controller;

import com.redecuidar.dto.AvaliacaoDTO;
import com.redecuidar.dto.AvaliacaoRespostaDTO;
import com.redecuidar.dto.AvaliacaoAdminDTO;
import com.redecuidar.model.Avaliacao;
import com.redecuidar.service.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public Avaliacao criar(@RequestBody AvaliacaoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        dto.setEmailAvaliador(userDetails.getUsername());
        return avaliacaoService.salvar(dto);
    }

    // Endpoint para admin visualizar todas as avaliações
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Avaliacao> listarTodas() {
        return avaliacaoService.listarTodas(); // Inclui dados do avaliador
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<AvaliacaoAdminDTO> listarParaAdmin() {
        return avaliacaoService.listarParaAdmin(); // DTO específico para admin
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        avaliacaoService.excluir(id);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<AvaliacaoRespostaDTO>> listarPorUsuario(@PathVariable Long id) {
        List<AvaliacaoRespostaDTO> avaliacoes = avaliacaoService.listarDTOPorAvaliado(id);
        return ResponseEntity.ok(avaliacoes);
    }



}
