package com.example.EGA.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    // Supprimez la logique personnalisée ici, laissez Lombok faire
    private String email; 
    private String password;
    private String username; 
}