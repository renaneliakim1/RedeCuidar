package com.redecuidar.dto;

public class AvaliacaoAdminDTO {

    private String nomeAvaliador;
    private String comentario;

    public AvaliacaoAdminDTO(String nomeAvaliador, String comentario) {
        this.nomeAvaliador = nomeAvaliador;
        this.comentario = comentario;
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
}
