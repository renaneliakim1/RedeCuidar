package com.redecuidar.dto;

public class AvaliacaoAdminDTO {

    private Long id;
    private String nomeAvaliador;
    private String comentario;

    public AvaliacaoAdminDTO(Long id, String nomeAvaliador, String comentario) {
        this.id = id;
        this.nomeAvaliador = nomeAvaliador;
        this.comentario = comentario;
    }

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
}
