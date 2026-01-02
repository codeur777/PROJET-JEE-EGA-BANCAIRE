package com.example.EGA.controller;


import com.example.EGA.entity.Client;
import com.example.EGA.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadDocument(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file) {
    
    try {
        // Vérifier que le fichier n'est pas vide
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier vide");
        }
        
        // Sauvegarder le fichier (exemple simple)
        String fileName = file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/clients/" + id);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return ResponseEntity.ok("Fichier uploadé avec succès: " + fileName);
        
    } catch (IOException e) {
        return ResponseEntity.status(500).body("Erreur lors de l'upload: " + e.getMessage());
    }
}
}
