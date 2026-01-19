package com.example.EGA.service;

import com.example.EGA.entity.User;

import java.util.List;

public interface AdminService {

    /**
     * Crée un compte agent (utilisateur)
     */
    User createAgent(User agent);

    /**
     * Récupère tous les agents
     */
    List<User> getAllAgents();

    /**
     * Supprime un agent par son ID
     */
    void deleteAgent(Long id);

    /**
     * Vérifie si l'utilisateur connecté est un admin
     */
    boolean isAdmin(String email);
}