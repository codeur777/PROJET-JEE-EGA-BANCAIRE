package com.example.EGA.service.impl;

import com.example.EGA.entity.Client;
import com.example.EGA.repository.ClientRepository;
import com.example.EGA.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client introuvable"));
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client updateClient(Long id, Client client) {
        Client existing = getClientById(id);
        existing.setNom(client.getNom());
        existing.setPrenom(client.getPrenom());
        existing.setAdresse(client.getAdresse());
        existing.setDateNaissance(client.getDateNaissance());
        existing.setTelephone(client.getTelephone());
        existing.setEmail(client.getEmail());
        existing.setNationalite(client.getNationalite());
        existing.setSexe(client.getSexe());
        return clientRepository.save(existing);
    }

    @Override
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
