package com.example.profei.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.profei.model.AuthToken;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);
}
