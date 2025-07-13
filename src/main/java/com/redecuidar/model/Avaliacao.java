package com.redecuidar.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comentario;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliador_id")
    @JsonBackReference(value = "avaliacoes-feitas")
    @JsonIgnoreProperties({"avaliacoesFeitas", "avaliacoesRecebidas", "senha", "fotoPerfil", "especialidade"})
    private Usuario avaliador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliado_id")
    @JsonBackReference(value = "avaliacoes-recebidas")
    private Usuario avaliado;

    public Avaliacao() {}

    public Avaliacao(String comentario, Usuario avaliador, Usuario avaliado) {
        this.comentario = comentario;
        this.avaliador = avaliador;
        this.avaliado = avaliado;
        this.dataCriacao = LocalDateTime.now();
    }

    // Getters e setters

    public Long getId() {
        return id;
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

    public Usuario getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Usuario avaliador) {
        this.avaliador = avaliador;
    }

    public Usuario getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Usuario avaliado) {
        this.avaliado = avaliado;
    }
}
