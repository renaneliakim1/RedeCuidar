package com.redecuidar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;


@Entity
@Data
@NoArgsConstructor
@Table(name = "usuarios")
public class Usuario  implements UserDetails {


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (this.email.equalsIgnoreCase("admin@redecuidar.com")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }



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


    private String cep;
    private String bairro;
    private String cidade;
    private String estado;


    private boolean ofereceServico;

    private String fotoPerfil;

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