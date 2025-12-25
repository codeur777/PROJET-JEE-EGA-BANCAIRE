package com.example.EGA.controller;

import com.example.EGA.dto.AuthRequestDTO;
import com.example.EGA.dto.AuthResponseDTO;
import com.example.EGA.config.JwtUtils;
import com.example.EGA.entity.User;
import com.example.EGA.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok("Utilisateur enregistré avec succès !");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        User user = userService.login(request);
        String token = jwtUtils.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDTO(token, "Connexion réussie !"));
    }
}
