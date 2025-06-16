package com.redecuidar.repository;

import com.redecuidar.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByPrestadorId(Long prestadorId);
    List<Servico> findByCategoria(Servico.CategoriaServico categoria);
    List<Servico> findByDisponivelTrue();
}