package com.redecuidar.repository;

import com.redecuidar.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByAvaliadoId(Long avaliadoId);

    // Corrigido para buscar o avaliador junto
    @Query("SELECT a FROM Avaliacao a JOIN FETCH a.avaliador")
    List<Avaliacao> findAllComAvaliador();
}
