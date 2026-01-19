package com.example.EGA.service.impl;

import com.example.EGA.entity.Client;
import com.example.EGA.entity.ClientAuth;
import com.example.EGA.repository.ClientAuthRepository;
import com.example.EGA.repository.ClientRepository;
import com.example.EGA.service.ClientAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientAuthServiceImpl implements ClientAuthService {

    private final ClientAuthRepository clientAuthRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public ClientAuth createClientAuth(Long clientId, String password) {
        // Vérifier que le client existe
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        // Vérifier qu'un compte d'authentification n'existe pas déjà
        if (clientAuthRepository.existsByClientId(clientId)) {
            throw new RuntimeException("Un compte d'authentification existe déjà pour ce client");
        }

        // Créer le compte d'authentification
        ClientAuth clientAuth = ClientAuth.builder()
                .client(client)
                .email(client.getEmail())
                .password(passwordEncoder.encode(password))
                .actif(true)
                .build();

        return clientAuthRepository.save(clientAuth);
    }

    @Override
    public boolean canCreateAuth(String nom, String prenom, String email) {
        return clientRepository.existsByNomAndPrenomAndEmail(nom, prenom, email);
    }

    @Override
    public ClientAuth authenticateClient(String email, String password) {
        ClientAuth clientAuth = clientAuthRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!clientAuth.isActif()) {
            throw new RuntimeException("Compte désactivé");
        }

        if (!passwordEncoder.matches(password, clientAuth.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        return clientAuth;
    }

    @Override
    public ClientAuth findByClientId(Long clientId) {
        return clientAuthRepository.findByClientId(clientId)
                .orElse(null);
    }
}