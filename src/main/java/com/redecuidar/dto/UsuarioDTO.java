package com.redecuidar.dto;

import com.redecuidar.model.Usuario;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;


    // Validação básica do formato do CEP (opcional)
    @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido")
    private String cep;

    private String bairro;

    private String cidade;

    private String estado;

    private String fotoPerfil;

    private Boolean ofereceServico;

    private Usuario.Especialidade especialidade;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricaoServico;

    public Usuario toUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNome(this.nome);
        usuario.setEmail(this.email);
        usuario.setSenha(this.senha); // criptografar no service
        usuario.setTelefone(this.telefone);
/*
        usuario.setEndereco(this.endereco);
*/
        usuario.setOfereceServico(this.ofereceServico);
        usuario.setEspecialidade(this.especialidade);
        usuario.setDescricaoServico(this.descricaoServico);
        usuario.setFotoPerfil(this.fotoPerfil);
        usuario.setCep(this.cep);
        usuario.setBairro(this.bairro);
        usuario.setCidade(this.cidade);
        usuario.setEstado(this.estado);

        return usuario;
    }
}
