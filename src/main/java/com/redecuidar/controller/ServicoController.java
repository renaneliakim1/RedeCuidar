package com.redecuidar.controller;

import com.redecuidar.dto.ServicoDTO;
import com.redecuidar.model.Servico;
import com.redecuidar.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @PostMapping
    public ResponseEntity<Servico> criarServico(@RequestBody ServicoDTO servicoDTO) {
        Servico servico = servicoService.criarServico(servicoDTO);
        return ResponseEntity.ok(servico);
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listarServicos() {
        List<Servico> servicos = servicoService.listarTodosServicos();
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> buscarServicoPorId(@PathVariable Long id) {
        return servicoService.buscarServicoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> atualizarServico(@PathVariable Long id, @RequestBody ServicoDTO servicoDTO) {
        Servico servico = servicoService.atualizarServico(id, servicoDTO);
        return ResponseEntity.ok(servico);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarServico(@PathVariable Long id) {
        servicoService.deletarServico(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/prestador/{prestadorId}")
    public ResponseEntity<List<Servico>> listarServicosPorPrestador(@PathVariable Long prestadorId) {
        List<Servico> servicos = servicoService.listarServicosPorPrestador(prestadorId);
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Servico>> listarServicosPorCategoria(@PathVariable Servico.CategoriaServico categoria) {
        List<Servico> servicos = servicoService.listarServicosPorCategoria(categoria);
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Servico>> listarServicosDisponiveis() {
        List<Servico> servicos = servicoService.listarServicosDisponiveis();
        return ResponseEntity.ok(servicos);
    }



}