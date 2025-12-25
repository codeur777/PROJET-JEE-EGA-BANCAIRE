package com.example.EGA.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.iban4j.Iban;
import org.iban4j.IbanFormatException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String numeroCompte;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TypeCompte typeCompte;

    private LocalDate dateCreation;

    @NotNull
    private BigDecimal solde = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client proprietaire;

    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    @PrePersist
    public void generateNumeroCompte() {
        if (numeroCompte == null || numeroCompte.isEmpty()) {
            try {
                Iban iban = Iban.random(); // génère un IBAN aléatoire
                this.numeroCompte = iban.toString();
            } catch (IbanFormatException e) {
                this.numeroCompte = "EG" + System.currentTimeMillis();
            }
        }
        if (dateCreation == null) {
            dateCreation = LocalDate.now();
        }
    }
}
