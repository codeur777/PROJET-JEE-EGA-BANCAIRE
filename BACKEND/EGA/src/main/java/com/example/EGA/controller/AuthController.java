package com.example.EGA.controller;

import com.example.EGA.dto.AuthRequestDTO;
import com.example.EGA.dto.AuthResponseDTO;
import com.example.EGA.dto.ClientAuthDTO;
import com.example.EGA.config.JwtUtils;
import com.example.EGA.entity.User;
import com.example.EGA.entity.ClientAuth;
import com.example.EGA.service.UserService;
import com.example.EGA.service.ClientAuthService;
import com.example.EGA.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
    private final ClientAuthService clientAuthService;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok(Map.of("message", "Utilisateur enregistré avec succès !"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        try {
            // Déterminer le type de connexion
            String loginType = determineLoginType(request.getEmail());

            if ("CLIENT".equals(loginType)) {
                // Connexion client
                ClientAuth clientAuth = clientAuthService.authenticateClient(request.getEmail(), request.getPassword());

                // Générer un token avec le rôle CLIENT
                String token = jwtUtils.generateTokenForClient(clientAuth);

                ClientAuthDTO response = ClientAuthDTO.builder()
                        .id(clientAuth.getId())
                        .clientId(clientAuth.getClient().getId())
                        .email(clientAuth.getEmail())
                        .nom(clientAuth.getClient().getNom())
                        .prenom(clientAuth.getClient().getPrenom())
                        .build();

                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", response,
                    "role", "CLIENT",
                    "message", "Connexion client réussie !"
                ));

            } else {
                // Connexion agent/admin
                User user = userService.login(request);
                String token = jwtUtils.generateToken(user);

                // Créer un objet user pour la réponse
                Map<String, Object> userResponse = Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "role", user.getRole()
                );

                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userResponse,
                    "role", user.getRole(),
                    "message", "Connexion " + user.getRole().toLowerCase() + " réussie !"
                ));
            }

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("message", "Erreur lors de la connexion : " + e.getMessage()));
        }
    }

    /**
     * Détermine le type de connexion basé sur l'email
     */
    private String determineLoginType(String email) {
        // Vérifier d'abord si c'est un client
        try {
            if (clientAuthService.findByEmail(email) != null) {
                return "CLIENT";
            }
        } catch (Exception e) {
            // Si la recherche échoue, ce n'est pas un client
        }

        // Par défaut, c'est un agent/admin
        return "AGENT";
    }
}