package com.redecuidar.repository;

import com.redecuidar.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByOfereceServicoTrue();
    List<Usuario> findByOfereceServicoTrueAndEspecialidade(Usuario.Especialidade especialidade);

}