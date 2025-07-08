package com.redecuidar.service;

import com.redecuidar.dto.AvaliacaoAdminDTO;
import com.redecuidar.dto.AvaliacaoDTO;
import com.redecuidar.dto.AvaliacaoRespostaDTO;
import com.redecuidar.model.Avaliacao;
import com.redecuidar.model.Usuario;
import com.redecuidar.repository.AvaliacaoRepository;
import com.redecuidar.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, UsuarioRepository usuarioRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Avaliacao salvar(AvaliacaoDTO dto) {
        Usuario avaliador = usuarioRepository.findByEmail(dto.getEmailAvaliador())
                .orElseThrow(() -> new RuntimeException("Avaliador não encontrado"));

        Usuario avaliado = usuarioRepository.findById(dto.getIdAvaliado())
                .orElseThrow(() -> new RuntimeException("Avaliado não encontrado"));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setAvaliador(avaliador);
        avaliacao.setAvaliado(avaliado);
        avaliacao.setDataCriacao(LocalDateTime.now());

        return avaliacaoRepository.save(avaliacao);
    }

    public List<Avaliacao> listarPorAvaliado(Long idAvaliado) {
        return avaliacaoRepository.findByAvaliadoId(idAvaliado);
    }

    // Corrigido: agora usa findAllComAvaliador
    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAllComAvaliador();
    }

    public void excluir(Long id) {
        avaliacaoRepository.deleteById(id);
    }

    public List<AvaliacaoRespostaDTO> listarDTOPorAvaliado(Long idAvaliado) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByAvaliadoId(idAvaliado);
        return avaliacoes.stream()
                .map(av -> new AvaliacaoRespostaDTO(
                        av.getAvaliador().getNome(),
                        av.getComentario(),
                        av.getDataCriacao()
                )).toList();
    }

    public List<AvaliacaoAdminDTO> listarParaAdmin() {
        return avaliacaoRepository.findAllComAvaliador().stream()
                .map(av -> new AvaliacaoAdminDTO(
                        av.getId(), // ✅ Adiciona o id da avaliação
                        av.getAvaliador() != null ? av.getAvaliador().getNome() : "Usuário",
                        av.getComentario()
                ))
                .collect(Collectors.toList());
    }

}
