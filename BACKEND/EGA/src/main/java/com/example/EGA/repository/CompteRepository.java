package com.example.EGA.repository;

import com.example.EGA.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    
    // Méthode qui ignore les espaces dans la comparaison
    @Query("SELECT c FROM Compte c WHERE REPLACE(c.numeroCompte, ' ', '') = REPLACE(:numeroCompte, ' ', '')")
    Optional<Compte> findByNumeroCompte(@Param("numeroCompte") String numeroCompte);
    
    // Méthode avec jointure pour charger le client aussi
    @Query("SELECT c FROM Compte c LEFT JOIN FETCH c.proprietaire WHERE REPLACE(c.numeroCompte, ' ', '') = REPLACE(:numeroCompte, ' ', '')")
    Optional<Compte> findByNumeroCompteWithClient(@Param("numeroCompte") String numeroCompte);
    
    // Méthode pour récupérer un compte par ID avec le client chargé
    @Query("SELECT c FROM Compte c LEFT JOIN FETCH c.proprietaire WHERE c.id = :id")
    Optional<Compte> findByIdWithClient(@Param("id") Long id);
}