package com.example.EGA.dto;

import com.example.EGA.enumerate.TypeCompte;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CompteDto {
    private Long id;
    private String numeroCompte;
    private TypeCompte typeCompte;
    private LocalDate dateCreation;
    private double solde;
    private Long clientId; // Référence au Client
}

