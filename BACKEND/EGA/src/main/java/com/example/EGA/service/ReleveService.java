package com.example.EGA.service;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Transaction;
import com.example.EGA.entity.Client;
import java.time.LocalDate;
import java.util.List;

public interface ReleveService {
    byte[] generateRelevePDF(Long compteId, LocalDate dateDebut, LocalDate dateFin);
    List<Transaction> getTransactionsForReleve(Long compteId, LocalDate dateDebut, LocalDate dateFin);
}