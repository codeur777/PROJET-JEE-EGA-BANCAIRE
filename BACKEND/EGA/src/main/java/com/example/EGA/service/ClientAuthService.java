package com.example.EGA.service;

import com.example.EGA.entity.Client;
import com.example.EGA.entity.ClientAuth;

public interface ClientAuthService {

    /**
     * Crée un compte d'authentification pour un client existant
     */
    ClientAuth createClientAuth(Long clientId, String password);

    /**
     * Vérifie si un client peut créer un compte d'authentification
     */
    boolean canCreateAuth(String nom, String prenom, String email);

    /**
     * Authentifie un client
     */
    ClientAuth authenticateClient(String email, String password);

    /**
     * Trouve l'authentification d'un client par son ID
     */
    ClientAuth findByClientId(Long clientId);
}