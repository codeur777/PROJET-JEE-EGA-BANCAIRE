package com.example.EGA.controller;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AccountController {

    private final CompteService compteService;

    @PostMapping
    public Compte create(@RequestBody Compte compte) {
        return compteService.createAccount(compte);
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
}

