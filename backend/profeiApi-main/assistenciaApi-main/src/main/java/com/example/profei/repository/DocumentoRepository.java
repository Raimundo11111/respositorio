package com.example.profei.repository;


import com.example.profei.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author R
 */
@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
}
