package com.redecuidar.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AvaliacaoRespostaDTO {

    private String nomeAvaliador;
    private String comentario;
    private String dataCriacao;

    public AvaliacaoRespostaDTO(String nomeAvaliador, String comentario, LocalDateTime dataCriacao) {
        this.nomeAvaliador = nomeAvaliador;
        this.comentario = comentario;
        this.dataCriacao = dataCriacao.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
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
