package com.example.EGA.controller;

import com.example.EGA.dto.AuthRequestDTO;
import com.example.EGA.dto.AuthResponseDTO;
import com.example.EGA.config.JwtUtils;
import com.example.EGA.entity.User;
import com.example.EGA.service.UserService;
import com.example.EGA.exception.AuthenticationException; // Assurez-vous d'importer votre exception
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
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
            // 1. Appel au service (vérifie email et password)
            User user = userService.login(request);
            
            // 2. Génération du Token
            String token = jwtUtils.generateToken(user);
            
            // 3. Réponse propre
            return ResponseEntity.ok(new AuthResponseDTO(token, "Connexion réussie !"));
            
        } catch (AuthenticationException e) {
            // Renvoie 401 si les identifiants sont faux
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Renvoie 400 ou 500 pour les autres erreurs
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("message", "Erreur lors de la connexion : " + e.getMessage()));
        }
    }
}