package com.example.EGA.repository;

import com.example.EGA.entity.ClientAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientAuthRepository extends JpaRepository<ClientAuth, Long> {

    Optional<ClientAuth> findByEmail(String email);

    Optional<ClientAuth> findByClientId(Long clientId);

    boolean existsByEmail(String email);

    boolean existsByClientId(Long clientId);
}