package com.example.EGA.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EGA.entity.User;
import com.example.EGA.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/agents")
    public ResponseEntity<?> createAgent(@RequestBody Map<String, String> agentData) {
        try {
            User agent = new User();
            agent.setEmail(agentData.get("email"));
            agent.setPassword(agentData.get("password"));
            agent.setRole("AGENT");

            User createdAgent = adminService.createAgent(agent);
            return ResponseEntity.ok(Map.of(
                "message", "Agent créé avec succès",
                "agent", Map.of(
                    "id", createdAgent.getId(),
                    "username", createdAgent.getUsername(), // Use email as username since User entity uses email as username
                    "email", createdAgent.getEmail(),
                    "role", createdAgent.getRole()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        List<User> agents = adminService.getAllAgents();
        return ResponseEntity.ok(agents);
    }

    @DeleteMapping("/agents/{id}")
    public ResponseEntity<?> deleteAgent(@PathVariable Long id) {
        try {
            adminService.deleteAgent(id);
            return ResponseEntity.ok(Map.of("message", "Agent supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/is-admin/{email}")
    public ResponseEntity<Boolean> isAdmin(@PathVariable String email) {
        boolean isAdmin = adminService.isAdmin(email);
        return ResponseEntity.ok(isAdmin);
    }
}