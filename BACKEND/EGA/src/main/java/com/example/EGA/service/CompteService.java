package com.example.EGA.service;

import com.example.EGA.entity.Compte;
import com.example.EGA.entity.Client;
import java.util.List;

public interface CompteService {
    Compte createCompte(Client client, Compte compte);
    Compte getCompteById(Long id);
    List<Compte> getAllComptes();
    void deleteCompte(Long id);
}
