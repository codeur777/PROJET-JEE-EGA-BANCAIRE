package com.example.EGA.controller;

import com.example.EGA.entity.Transaction;
import com.example.EGA.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> list() {
        return transactionService.listAll();
    }
}
