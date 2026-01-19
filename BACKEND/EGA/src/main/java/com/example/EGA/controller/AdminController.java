package com.example.EGA.controller;

import com.example.EGA.entity.User;
import com.example.EGA.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
                    "username", createdAgent.getUsername(),
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