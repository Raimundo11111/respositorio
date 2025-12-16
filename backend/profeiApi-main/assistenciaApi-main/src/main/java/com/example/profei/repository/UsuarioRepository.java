package com.example.profei.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.profei.model.Usuario;

/**
 *
 * @author R
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
