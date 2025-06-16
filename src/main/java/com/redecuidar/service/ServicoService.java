package com.redecuidar.service;

import com.redecuidar.dto.ServicoDTO;
import com.redecuidar.model.Servico;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.ServicoRepository;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Servico criarServico(ServicoDTO servicoDTO) {
        Usuario prestador = usuarioRepository.findById(servicoDTO.getPrestadorId())
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado"));

        Servico servico = servicoDTO.toServico();
        servico.setPrestador(prestador);
        return servicoRepository.save(servico);
    }

    public List<Servico> listarTodosServicos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarServicoPorId(Long id) {
        return servicoRepository.findById(id);
    }

    public Servico atualizarServico(Long id, ServicoDTO servicoDTO) {
        return servicoRepository.findById(id)
                .map(servicoExistente -> {
                    Servico servico = servicoDTO.toServico();
                    servico.setId(id);
                    servico.setPrestador(servicoExistente.getPrestador());
                    return servicoRepository.save(servico);
                })
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
    }

    public void deletarServico(Long id) {
        servicoRepository.deleteById(id);
    }

    public List<Servico> listarServicosPorPrestador(Long prestadorId) {
        return servicoRepository.findByPrestadorId(prestadorId);
    }

    public List<Servico> listarServicosPorCategoria(Servico.CategoriaServico categoria) {
        return servicoRepository.findByCategoria(categoria);
    }

    public List<Servico> listarServicosDisponiveis() {
        return servicoRepository.findByDisponivelTrue();
    }
}