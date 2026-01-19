package com.example.EGA.controller;

import com.example.EGA.dto.ClientAuthDTO;
import com.example.EGA.dto.ClientLoginDTO;
import com.example.EGA.dto.CreateClientAuthDTO;
import com.example.EGA.entity.ClientAuth;
import com.example.EGA.service.ClientAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client-auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientAuthController {

    private final ClientAuthService clientAuthService;

    @PostMapping("/create")
    public ResponseEntity<?> createClientAuth(@RequestBody CreateClientAuthDTO request) {
        try {
            // Vérifier que les informations correspondent à un client existant
            if (!clientAuthService.canCreateAuth(request.getNom(), request.getPrenom(), request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body("Informations incorrectes. Vérifiez votre nom, prénom et email.");
            }

            // Trouver le client pour créer l'authentification
            // TODO: Implémenter la logique pour récupérer le client ID
            // Pour l'instant, on suppose que le client ID est fourni
            ClientAuth clientAuth = clientAuthService.createClientAuth(request.getClientId(), request.getPassword());

            return ResponseEntity.ok("Compte de connexion créé avec succès");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ClientLoginDTO loginDTO) {
        try {
            ClientAuth clientAuth = clientAuthService.authenticateClient(loginDTO.getEmail(), loginDTO.getPassword());

            // TODO: Générer un token JWT pour la session client
            ClientAuthDTO response = ClientAuthDTO.builder()
                    .id(clientAuth.getId())
                    .clientId(clientAuth.getClient().getId())
                    .email(clientAuth.getEmail())
                    .nom(clientAuth.getClient().getNom())
                    .prenom(clientAuth.getClient().getPrenom())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/can-create/{nom}/{prenom}/{email}")
    public ResponseEntity<Boolean> canCreateAuth(@PathVariable String nom,
                                                @PathVariable String prenom,
                                                @PathVariable String email) {
        boolean canCreate = clientAuthService.canCreateAuth(nom, prenom, email);
        return ResponseEntity.ok(canCreate);
    }
}