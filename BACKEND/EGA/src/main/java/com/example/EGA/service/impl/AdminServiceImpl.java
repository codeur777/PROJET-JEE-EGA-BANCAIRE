package com.example.EGA.service.impl;

import com.example.EGA.entity.User;
import com.example.EGA.repository.UserRepository;
import com.example.EGA.service.AdminService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Email admin prédéfini
    private static final String ADMIN_EMAIL = "admin@egabank.tg";

    @Override
    public User createAgent(User agent) {
        // Vérifier que l'email n'existe pas déjà
        if (userRepository.existsByEmail(agent.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Encoder le mot de passe
        agent.setPassword(passwordEncoder.encode(agent.getPassword()));

        return userRepository.save(agent);
    }

    @Override
    public List<User> getAllAgents() {
        return userRepository.findByRole("AGENT");
    }

    @Override
    public void deleteAgent(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public boolean isAdmin(String email) {
        return ADMIN_EMAIL.equals(email);
    }
}