package com.redecuidar.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AvaliacaoAdminDTO {

    private Long id;
    private String nomeAvaliador;
    private String comentario;
    private String dataCriacao;

    // Construtor com data de criação (CORRETO)
    public AvaliacaoAdminDTO(Long id, String nomeAvaliador, String comentario, LocalDateTime dataCriacao) {
        this.id = id;
        this.nomeAvaliador = nomeAvaliador;
        this.comentario = comentario;
        this.dataCriacao = dataCriacao.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeAvaliador() {
        return nomeAvaliador;
    }

    public void setNomeAvaliador(String nomeAvaliador) {
        this.nomeAvaliador = nomeAvaliador;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
