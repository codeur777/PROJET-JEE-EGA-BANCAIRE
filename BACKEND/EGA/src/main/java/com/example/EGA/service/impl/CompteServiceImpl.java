package com.example.EGA.service.impl;



import com.example.EGA.dto.CompteDto;
import com.example.EGA.entity.Client;
import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.repository.ClientRepository;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.service.CompteService;
import com.example.EGA.service.TransactionService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompteServiceImpl implements CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final TransactionService transactionService;

    

    @Override
    public Compte createAccount(CompteDto dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        Compte compte = Compte.builder()
                .numeroCompte(dto.getNumeroCompte())
                .typeCompte(dto.getTypeCompte())
                .solde(BigDecimal.valueOf(dto.getSolde()))
                .dateCreation(LocalDate.now())
                .proprietaire(client)
                .build();

        return compteRepository.save(compte);
    }

    @Override
    public Compte getCompteById(Long id) {
        return compteRepository.findByIdWithClient(id)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
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
        transactionService.depot(id, amount);
    }

    @Override
    public void withdraw(Long id, double amount) {
        transactionService.retrait(id, amount);
    }

    @Override
    public void transfer(Long from, Long to, double amount) {
        transactionService.virement(from, to, amount);
    }

    @Override
    public List<Transaction> getTransactionsWithinPeriod(
            Long id,
            LocalDateTime start,
            LocalDateTime end
    ) {
        return transactionService.getTransactionsByCompteAndPeriod(id, start, end);
    }

    @Override
    public List<Compte> getComptesByClientId(Long clientId) {
        return compteRepository.findByProprietaireId(clientId);
    }
}