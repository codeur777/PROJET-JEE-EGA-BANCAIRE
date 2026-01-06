package com.example.EGA.service;

import com.example.EGA.entity.Transaction;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    List<Transaction> listAll();
    void depot(Long compteId, double montant);
    void retrait(Long compteId, double montant);
    void virement(Long sourceId, Long destinationId, double montant);
    List<Transaction> getTransactionsByCompteAndPeriod(Long compteId, LocalDateTime start, LocalDateTime end);
}