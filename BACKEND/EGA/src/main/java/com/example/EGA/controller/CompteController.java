package com.example.EGA.controller;

import com.example.EGA.dto.CompteDto;
import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CompteController {

    private final CompteService compteService;

/* 
    @PostMapping
    public Compte create(@RequestBody CompteDto dto) {
    return compteService.createAccount(dto);
    }

*/

    @GetMapping
    public List<Compte> getAll() {
        return compteService.getAllComptes();
    }

    @PostMapping("/{id}/deposit/{amount}")
    public String deposit(@PathVariable Long id, @PathVariable double amount) {
        compteService.deposit(id, amount);
        return "Versement effectué avec succès !";
    }

    @PostMapping("/{id}/withdraw/{amount}")
    public String withdraw(@PathVariable Long id, @PathVariable double amount) {
        compteService.withdraw(id, amount);
        return "Retrait effectué avec succès !";
    }

    @PostMapping("/transfer")
    public String transfer(@RequestParam Long from, @RequestParam Long to, @RequestParam double amount) {
        compteService.transfer(from, to, amount);
        return "Virement effectué avec succès !";
    }

    @GetMapping("/{id}/transactions")
    public List<Transaction> getTransactions(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime start,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime end) {
        return compteService.getTransactionsWithinPeriod(id, start, end);
    }

    @PostMapping
    public ResponseEntity<Compte> create(@RequestBody CompteDto dto) {
        Compte compte = compteService.createAccount(dto);
        return ResponseEntity.ok(compte); // ✅ JSON valide
    }

}

