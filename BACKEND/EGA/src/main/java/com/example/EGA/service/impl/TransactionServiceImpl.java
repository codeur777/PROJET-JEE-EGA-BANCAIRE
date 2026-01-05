package com.example.EGA.service.impl;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.enumerate.TypeTransaction;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.repository.TransactionRepository;
import com.example.EGA.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    @Override
    public List<Transaction> listAll() {
        return transactionRepository.findAll();
    }

    @Override
    @Transactional
    public void depot(Long compteId, double montant) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        
        compte.setSolde(compte.getSolde().add(BigDecimal.valueOf(montant)));
        compteRepository.save(compte);

        Transaction t = Transaction.builder()
                .compte(compte)
                .typeTransaction(TypeTransaction.DEPOT)
                .montant(BigDecimal.valueOf(montant))
                .build();
        transactionRepository.save(t);
    }

    @Override
    @Transactional
    public void retrait(Long compteId, double montant) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        
        if (compte.getSolde().compareTo(BigDecimal.valueOf(montant)) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }
        
        compte.setSolde(compte.getSolde().subtract(BigDecimal.valueOf(montant)));
        compteRepository.save(compte);

        Transaction t = Transaction.builder()
                .compte(compte)
                .typeTransaction(TypeTransaction.RETRAIT)
                .montant(BigDecimal.valueOf(montant))
                .build();
        transactionRepository.save(t);
    }

    @Override
    @Transactional
    public void virement(Long sourceId, Long destinationId, double montant) {
        Compte source = compteRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Compte source introuvable"));
        Compte destination = compteRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Compte destination introuvable"));
        
        if (source.getSolde().compareTo(BigDecimal.valueOf(montant)) < 0) {
            throw new RuntimeException("Solde insuffisant pour virement");
        }
        
        // Retrait du compte source
        source.setSolde(source.getSolde().subtract(BigDecimal.valueOf(montant)));
        compteRepository.save(source);

        // Dépôt sur compte destination
        destination.setSolde(destination.getSolde().add(BigDecimal.valueOf(montant)));
        compteRepository.save(destination);

        Transaction t = Transaction.builder()
                .compte(source)
                .compteDestinataire(destination)
                .typeTransaction(TypeTransaction.VIREMENT)
                .montant(BigDecimal.valueOf(montant))
                .build();
        transactionRepository.save(t);
    }

    @Override
    public List<Transaction> getTransactionsByCompteAndPeriod(Long compteId, LocalDateTime start, LocalDateTime end) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        return transactionRepository.findByCompteAndDateTransactionBetween(compte, start, end);
    }
}