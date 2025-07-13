package com.redecuidar.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class AvaliacaoDTO {
    private String emailAvaliador;
    private Long idAvaliado;
    private String comentario;
    private int nota;
    private String nomeAvaliador;

    public String getEmailAvaliador() {
        return emailAvaliador;
    }

    public void setEmailAvaliador(String emailAvaliador) {
        this.emailAvaliador = emailAvaliador;
    }

    public Long getIdAvaliado() {
        return idAvaliado;
    }

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataCriacao;


    public void setIdAvaliado(Long idAvaliado) {
        this.idAvaliado = idAvaliado;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
