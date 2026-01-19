package com.example.EGA.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class PasswordGenerator {

    @Bean
    CommandLineRunner generatePasswords() {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            System.out.println("admin123 -> " + encoder.encode("admin123"));
            System.out.println("agent123 -> " + encoder.encode("agent123"));
        };
    }
}
