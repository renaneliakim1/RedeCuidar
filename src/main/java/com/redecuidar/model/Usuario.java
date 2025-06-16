package com.redecuidar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;

    private boolean ofereceServico;

    @Enumerated(EnumType.STRING)
    private Especialidade especialidade;

    private String descricaoServico;

    private Double avaliacaoMedia = 0.0;

    public enum Especialidade {
        CUIDADOR,
        BABA,
        ENFERMEIRO,
        FISIOTERAPEUTA,
        MEDICO,
        PSICOLOGO,
        NUTRICIONISTA,
        BARBEIRO_A_DOMICILIO,
        FAXINEIRO
    }
}