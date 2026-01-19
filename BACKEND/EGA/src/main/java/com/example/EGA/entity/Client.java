package com.example.EGA.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import com.example.EGA.enumerate.Sexe;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "clients")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;


    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    @NotBlank(message = "Adresse obligatoire")
    private String adresse;

    @NotBlank(message = "Numéro de téléphone obligatoire")
    private String telephone;

    @Email(message = "Email invalide")
    @NotBlank(message = "Email obligatoire")
    private String email;

    @NotBlank(message = "Nationalité obligatoire")
    private String nationalite;

    @NotBlank(message = "Statut obligatoire")
    private String statut;        // ex: ACTIF
    @NotBlank(message = "Ville obligatoire")
    private String ville;
    @NotBlank(message = "Code postal obligatoire")
    private String codePostal;
    @NotBlank(message = "Type de document obligatoire")
    private String typeDocument;
    @NotBlank(message = "Numéro de document obligatoire")
    private String numeroDocument;

    private LocalDate dateInscription = LocalDate.now(); // Date d'inscription

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Compte> comptes;
}

