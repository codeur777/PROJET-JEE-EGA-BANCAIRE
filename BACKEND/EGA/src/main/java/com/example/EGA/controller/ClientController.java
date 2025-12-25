package com.example.EGA.controller;


import com.example.EGA.entity.Client;
import com.example.EGA.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public Client add(@RequestBody Client client) {
        return clientService.saveClient(client);
    }

    @GetMapping
    public List<Client> list() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Client get(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        clientService.deleteClient(id);
        return "Client supprimé avec succès !";
    }
}

   