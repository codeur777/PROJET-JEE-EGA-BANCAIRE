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
        return clientService.save(client);
    }

    @GetMapping
    public List<Client> list() {
        return clientService.listAll();
    }

    @GetMapping("/{id}")
    public Client get(@PathVariable Long id) {
        return clientService.findById(id);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) {
        return clientService.update(id, client);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        clientService.delete(id);
        return "Client supprimé avec succès !";
    }
}

   