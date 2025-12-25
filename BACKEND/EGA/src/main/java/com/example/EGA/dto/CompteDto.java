package com.example.EGA.dto;

import com.example.EGA.enumerate.TypeCompte;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CompteDto {
    private Long id;
    private String numeroCompte;
    private TypeCompte typeCompte;
    private LocalDate dateCreation;
    private double solde;
    private Long clientId; // Référence au Client
}

