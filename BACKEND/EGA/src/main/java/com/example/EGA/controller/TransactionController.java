package com.example.EGA.controller;

import com.example.EGA.entity.Transaction;
import com.example.EGA.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> list() {
        return transactionService.listAll();
    }

    @PostMapping(value = "/depot", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> depot(@RequestBody TransactionRequest request) {
        try {
            transactionService.depot(request.getCompteId(), request.getMontant());
            return ResponseEntity.ok("✅ Dépôt effectué avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erreur : " + e.getMessage());
        }
    }

    @PostMapping(value = "/retrait", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> retrait(@RequestBody TransactionRequest request) {
        try {
            transactionService.retrait(request.getCompteId(), request.getMontant());
            return ResponseEntity.ok("✅ Retrait effectué avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erreur : " + e.getMessage());
        }
    }

    @PostMapping(value = "/virement", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> virement(@RequestBody VirementRequest request) {
        try {
            transactionService.virement(request.getSource(), request.getDestination(), request.getMontant());
            return ResponseEntity.ok("✅ Virement effectué avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/historique/{compteId}")
    public ResponseEntity<?> getHistorique(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime debut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fin) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByCompteAndPeriod(compteId, debut, fin);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erreur : " + e.getMessage());
        }
    }

    // Classes internes pour les requêtes
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TransactionRequest {
        private Long compteId;
        private double montant;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class VirementRequest {
        private Long source;
        private Long destination;
        private double montant;
    }
}