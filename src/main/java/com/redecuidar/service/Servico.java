package com.redecuidar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "servicos")
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 10, max = 500, message = "Descrição deve ter entre 10 e 500 caracteres")
    private String descricao;

    @NotNull(message = "Categoria é obrigatória")
    @Enumerated(EnumType.STRING)
    private CategoriaServico categoria;

    @NotNull(message = "Preço é obrigatório")
    @PositiveOrZero(message = "Preço deve ser positivo ou zero")
    private Double preco;

    @NotNull(message = "Disponibilidade é obrigatória")
    private Boolean disponivel;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario prestador;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    public enum CategoriaServico {
        CUIDADOS_PESSOAIS, SAUDE_MENTAL, SAUDE_FISICA, EDUCACAO, OUTROS
    }
}