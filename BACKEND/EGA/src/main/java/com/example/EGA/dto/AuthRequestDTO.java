package com.example.EGA.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    // Supprimez la logique personnalisée ici, laissez Lombok faire
    private String email; 
    private String password;
    private String username; 
}