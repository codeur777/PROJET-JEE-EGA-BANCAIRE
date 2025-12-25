package com.example.EGA.service.impl;



import com.example.EGA.entity.Client;
import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.service.CompteService;
import com.example.EGA.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompteServiceImpl implements CompteService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionService transactionService;

    @Override
    public Compte createCompte(Client client, Compte compte) {
        compte.setProprietaire(client);
        compte.setSolde(compte.getSolde() != null ? compte.getSolde() : BigDecimal.ZERO);
        return compteRepository.save(compte);
    }

    @Override
    public Compte createAccount(Compte compte) {
        compte.setSolde(compte.getSolde() != null ? compte.getSolde() : BigDecimal.ZERO);
        return compteRepository.save(compte);
    }

    @Override
    public Compte getCompteById(Long id) {
        return compteRepository.findById(id).orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    @Override
    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    @Override
    public void deleteCompte(Long id) {
        compteRepository.deleteById(id);
    }

    @Override
    public void deposit(Long id, double amount) {
        Compte compte = getCompteById(id);
        transactionService.depot(compte, BigDecimal.valueOf(amount));
    }

    @Override
    public void withdraw(Long id, double amount) {
        Compte compte = getCompteById(id);
        transactionService.retrait(compte, BigDecimal.valueOf(amount));
    }

    @Override
    public void transfer(Long from, Long to, double amount) {
        Compte source = getCompteById(from);
        Compte destination = getCompteById(to);
        transactionService.virement(source, destination, BigDecimal.valueOf(amount));
    }

    @Override
    public List<Transaction> getTransactionsWithinPeriod(Long id, LocalDateTime start, LocalDateTime end) {
        Compte compte = getCompteById(id);
        return transactionService.getTransactionsByCompteAndPeriod(compte, start, end);
    }
}
