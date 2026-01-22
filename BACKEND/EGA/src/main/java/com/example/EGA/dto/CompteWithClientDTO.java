package com.example.EGA.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteWithClientDTO {
    private Long id;
    private String numeroCompte;
    private BigDecimal solde;
    private String typeCompte;
    private String statut;
    private LocalDate dateCreation;

    // Informations du client
    private Long clientId;
    private String clientNom;
    private String clientPrenom;
    private String clientEmail;
}