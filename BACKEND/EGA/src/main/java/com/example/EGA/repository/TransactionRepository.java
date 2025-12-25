package com.example.EGA.repository;


import com.example.EGA.entity.Transaction;
import com.example.EGA.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCompteAndDateTransactionBetween(Compte compte, LocalDateTime start, LocalDateTime end);
}
