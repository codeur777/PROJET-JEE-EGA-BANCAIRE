package com.example.EGA.service.impl;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.enumerate.TypeTransaction;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.repository.TransactionRepository;
import com.example.EGA.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CompteRepository compteRepository;

    @Override
    public List<Transaction> listAll() {
        return transactionRepository.findAll();
    }

    @Override
    public Transaction depot(Compte compte, BigDecimal montant) {
        compte.setSolde(compte.getSolde().add(montant));
        compteRepository.save(compte);

        Transaction t = Transaction.builder()
                .compte(compte)
                .typeTransaction(TypeTransaction.DEPOT)
                .montant(montant)
                .build();
        return transactionRepository.save(t);
    }

    @Override
    public Transaction retrait(Compte compte, BigDecimal montant) {
        if (compte.getSolde().compareTo(montant) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }
        compte.setSolde(compte.getSolde().subtract(montant));
        compteRepository.save(compte);

        Transaction t = Transaction.builder()
                .compte(compte)
                .typeTransaction(TypeTransaction.RETRAIT)
                .montant(montant)
                .build();
        return transactionRepository.save(t);
    }

    @Override
    public Transaction virement(Compte source, Compte destination, BigDecimal montant) {
        if (source.getSolde().compareTo(montant) < 0) {
            throw new RuntimeException("Solde insuffisant pour virement");
        }
        // Retrait du compte source
        source.setSolde(source.getSolde().subtract(montant));
        compteRepository.save(source);

        // Dépôt sur compte destination
        destination.setSolde(destination.getSolde().add(montant));
        compteRepository.save(destination);

        Transaction t = Transaction.builder()
                .compte(source)
                .compteDestinataire(destination)
                .typeTransaction(TypeTransaction.VIREMENT)
                .montant(montant)
                .build();
        return transactionRepository.save(t);
    }

    @Override
    public List<Transaction> getTransactionsByCompteAndPeriod(Compte compte, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByCompteAndDateTransactionBetween(compte, start, end);
    }
}

