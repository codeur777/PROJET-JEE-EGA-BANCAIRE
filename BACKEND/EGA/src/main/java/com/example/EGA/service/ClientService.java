package com.example.EGA.service;

import com.example.EGA.entity.Client;
import java.util.List;

public interface ClientService {
    Client saveClient(Client client);
    Client getClientById(Long id);
    List<Client> getAllClients();
    Client updateClient(Long id, Client client);
    void deleteClient(Long id);
}
