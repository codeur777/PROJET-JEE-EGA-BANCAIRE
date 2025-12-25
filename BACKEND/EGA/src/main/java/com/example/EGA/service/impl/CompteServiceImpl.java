package com.example.EGA.service.impl;



import com.example.EGA.entity.Client;
import com.example.EGA.entity.Compte;
import com.example.EGA.repository.CompteRepository;
import com.example.EGA.service.CompteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompteServiceImpl implements CompteService {

    @Autowired
    private CompteRepository compteRepository;

    @Override
    public Compte createCompte(Client client, Compte compte) {
        compte.setProprietaire(client);
        compte.setSolde(compte.getSolde() != null ? compte.getSolde() : java.math.BigDecimal.ZERO);
        return compteRepository.save(compte);
    }

    @Override
    public Compte getCompteById(Long id) {
        return compteRepository.findById(id).orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    @Override
    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    @Override
    public void deleteCompte(Long id) {
        compteRepository.deleteById(id);
    }
}
