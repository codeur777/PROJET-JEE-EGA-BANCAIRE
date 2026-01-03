package com.example.EGA.service;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Client;
import com.example.EGA.entity.Transaction;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.EGA.dto.CompteDto;
/* public interface CompteService {
    Compte createCompte(Client client, Compte compte);
    Compte createAccount(Compte compte);
    Compte getCompteById(Long id);
    List<Compte> getAllComptes();
    void deleteCompte(Long id);
    void deposit(Long id, double amount);
    void withdraw(Long id, double amount);
    void transfer(Long from, Long to, double amount);
    List<Transaction> getTransactionsWithinPeriod(Long id, LocalDateTime start, LocalDateTime end);
} */

public interface CompteService {
    Compte createAccount(CompteDto dto);
    Compte getCompteById(Long id);
    List<Compte> getAllComptes();
    void deleteCompte(Long id);
    void deposit(Long id, double amount);
    void withdraw(Long id, double amount);
    void transfer(Long from, Long to, double amount);
    List<Transaction> getTransactionsWithinPeriod(Long id, LocalDateTime start, LocalDateTime end);
}
