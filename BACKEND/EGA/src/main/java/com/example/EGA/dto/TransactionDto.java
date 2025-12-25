package com.example.EGA.dto;


import com.example.EGA.enumerate.TypeTransaction;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private LocalDateTime date;
    private double montant;
    private TypeTransaction type;
    private Long compteSourceId;
    private Long compteDestinationId;
}
