package com.example.EGA.service.impl;

import com.example.EGA.dto.AuthRequestDTO;
import com.example.EGA.entity.User;
import com.example.EGA.exception.AuthenticationException;
import com.example.EGA.repository.UserRepository;
import com.example.EGA.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));
    }

    @Override
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public void register(User user) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Sauvegarder
        userRepository.save(user);
        
        System.out.println("✅ Utilisateur créé : " + user.getEmail());
    }

    @Override
    public User login(AuthRequestDTO request) {
        // Récupérer l'email (compatible avec username aussi)
        String email = request.getEmail() != null ? request.getEmail() : request.getUsername();
        
        System.out.println("🔍 Tentative de connexion avec email: " + email);
        
        // ✅ Utiliser AuthenticationException au lieu de RuntimeException
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("❌ Email non trouvé : " + email);
                    return new AuthenticationException("Email ou mot de passe incorrect");
                });

        System.out.println("✅ User trouvé : " + user.getEmail());

        // ✅ Utiliser AuthenticationException
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("❌ Mot de passe incorrect pour : " + email);
            throw new AuthenticationException("Email ou mot de passe incorrect");
        }

        System.out.println("✅ Connexion réussie pour : " + email);
        return user;
    }
}