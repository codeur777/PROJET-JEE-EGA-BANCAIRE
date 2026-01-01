package com.example.EGA.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SoldeInsuffisantException.class)
    public ResponseEntity<?> handleSoldeInsuffisant(SoldeInsuffisantException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // ✅ NOUVEAU : Gestion des erreurs d'authentification
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // ✅ NOUVEAU : Gestion des RuntimeException génériques (email déjà utilisé, etc.)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        // Si le message contient des mots-clés d'authentification
        if (ex.getMessage().contains("Email") || 
            ex.getMessage().contains("Mot de passe") ||
            ex.getMessage().contains("incorrect")) {
            return buildResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        
        // Si c'est une erreur de duplication (email déjà utilisé)
        if (ex.getMessage().contains("déjà utilisé")) {
            return buildResponse(ex.getMessage(), HttpStatus.CONFLICT);
        }
        
        // Autres erreurs
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex) {
        return buildResponse("Une erreur est survenue : " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return new ResponseEntity<>(body, status);
    }
}