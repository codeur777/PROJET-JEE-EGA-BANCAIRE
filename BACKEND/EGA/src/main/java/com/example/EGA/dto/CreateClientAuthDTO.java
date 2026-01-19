package com.example.EGA.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClientAuthDTO {
    private Long clientId;
    private String nom;
    private String prenom;
    private String email;
    private String password;
}