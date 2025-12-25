package com.example.EGA.service;


import com.example.EGA.entity.Transaction;
import com.example.EGA.entity.Compte;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    List<Transaction> listAll();
    Transaction depot(Compte compte, BigDecimal montant);
    Transaction retrait(Compte compte, BigDecimal montant);
    Transaction virement(Compte source, Compte destination, BigDecimal montant);
    List<Transaction> getTransactionsByCompteAndPeriod(Compte compte, LocalDateTime start, LocalDateTime end);
}
