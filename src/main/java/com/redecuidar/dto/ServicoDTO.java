package com.redecuidar.dto;

import com.redecuidar.model.Servico;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ServicoDTO {
    private Long id;

    @NotBlank
    private String titulo;

    @NotBlank
    @Size(min = 10, max = 500)
    private String descricao;

    @NotNull
    private Servico.CategoriaServico categoria;

    @NotNull
    @PositiveOrZero
    private Double preco;

    @NotNull
    private Boolean disponivel;

    @NotNull
    private Long prestadorId;

    public Servico toServico() {
        Servico servico = new Servico();
        servico.setTitulo(this.titulo);
        servico.setDescricao(this.descricao);
        servico.setCategoria(this.categoria);
        servico.setPreco(this.preco);
        servico.setDisponivel(this.disponivel);
        return servico;
    }
}