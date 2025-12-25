package com.example.EGA.dto;
    
import com.example.EGA.enumerate.Sexe;
import lombok.Data;
    
import java.time.LocalDate;
    
@Data
public class ClientDto {
    
        private Long id;
        private String nom;
        private String prenom;
        private LocalDate dateNaissance;
        private Sexe sexe;
        private String adresse;
        private String telephone;
        private String email;
        private String nationalite;
    
    
}


