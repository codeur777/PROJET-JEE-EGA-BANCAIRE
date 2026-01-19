package com.example.EGA.controller;

import com.example.EGA.entity.Client;
import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.service.ClientService;
import com.example.EGA.service.CompteService;
import com.example.EGA.service.ReleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CLIENT')")
public class ClientDashboardController {

    private final ClientService clientService;
    private final CompteService compteService;
    private final ReleveService releveService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            // TODO: Récupérer le client via l'email depuis ClientAuth
            // Pour l'instant, on retourne un message
            return ResponseEntity.ok(Map.of("message", "Profil client - " + email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/comptes")
    public ResponseEntity<?> getComptes(Authentication authentication) {
        try {
            // TODO: Extraire le clientId du token JWT
            // Pour l'instant, on simule avec un clientId fixe
            Long clientId = 1L; // À remplacer par l'extraction du token

            List<Compte> comptes = compteService.getComptesByClientId(clientId);
            List<Map<String, Object>> comptesDTO = comptes.stream()
                    .map(compte -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", compte.getId());
                        map.put("numeroCompte", compte.getNumeroCompte());
                        map.put("typeCompte", compte.getTypeCompte());
                        map.put("solde", compte.getSolde());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(comptesDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/operations/{compteId}")
    public ResponseEntity<?> getOperations(@PathVariable Long compteId,
                                          @RequestParam(required = false) LocalDate dateDebut,
                                          @RequestParam(required = false) LocalDate dateFin,
                                          Authentication authentication) {
        try {
            // TODO: Vérifier que le compte appartient bien au client connecté

            if (dateDebut == null) dateDebut = LocalDate.now().minusMonths(1);
            if (dateFin == null) dateFin = LocalDate.now();

            List<Transaction> transactions = releveService.getTransactionsForReleve(compteId, dateDebut, dateFin);

            List<Map<String, Object>> operationsDTO = transactions.stream()
                    .map(tx -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", tx.getId());
                        map.put("date", tx.getDateTransaction());
                        map.put("type", tx.getTypeTransaction());
                        map.put("montant", tx.getMontant());
                        map.put("libelle", getLibelle(tx));
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(operationsDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/releve/{compteId}")
    public ResponseEntity<?> generateReleve(@PathVariable Long compteId,
                                           @RequestParam LocalDate dateDebut,
                                           @RequestParam LocalDate dateFin,
                                           Authentication authentication) {
        try {
            // TODO: Vérifier que le compte appartient bien au client connecté

            byte[] pdf = releveService.generateRelevePDF(compteId, dateDebut, dateFin);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=releve.pdf")
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private String getLibelle(Transaction tx) {
        switch (tx.getTypeTransaction().name()) {
            case "DEPOT":
                return "Dépôt sur compte";
            case "RETRAIT":
                return "Retrait d'espèces";
            case "VIREMENT":
                if (tx.getCompteDestinataire() != null) {
                    return "Virement vers compte " + tx.getCompteDestinataire().getNumeroCompte();
                } else {
                    return "Virement depuis compte externe";
                }
            default:
                return "Opération bancaire";
        }
    }
}