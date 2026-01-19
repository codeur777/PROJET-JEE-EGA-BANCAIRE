package com.example.EGA.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.EGA.enumerate.TypeTransaction;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TypeTransaction typeTransaction;

    @NotNull
    private BigDecimal montant;

    private LocalDateTime dateTransaction;

    @ManyToOne
    @JoinColumn(name = "compte_id")
    @JsonIgnore
    private Compte compte;


    // Pour les virements
    @ManyToOne
    @JoinColumn(name = "compte_dest_id")
    private Compte compteDestinataire;

    @PrePersist
    public void prePersist() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
}