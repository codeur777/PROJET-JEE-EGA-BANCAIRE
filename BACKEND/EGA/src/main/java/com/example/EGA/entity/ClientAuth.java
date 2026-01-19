package com.example.EGA.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "client_auth")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private Client client;

    @NotBlank(message = "Mot de passe obligatoire")
    private String password;

    @Column(unique = true)
    private String email; // Redondant avec client.email pour faciliter les requêtes

    @Builder.Default
    private boolean actif = true;
}