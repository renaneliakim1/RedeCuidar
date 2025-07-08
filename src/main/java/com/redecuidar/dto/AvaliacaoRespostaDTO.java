package com.redecuidar.dto;

import java.time.LocalDateTime;

public class AvaliacaoRespostaDTO {

    private String nomeAvaliador;
    private String comentario;
    private LocalDateTime dataCriacao;

    public AvaliacaoRespostaDTO(String nomeAvaliador, String comentario, LocalDateTime dataCriacao) {
        this.nomeAvaliador = nomeAvaliador;
        this.comentario = comentario;
        this.dataCriacao = dataCriacao;
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

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
