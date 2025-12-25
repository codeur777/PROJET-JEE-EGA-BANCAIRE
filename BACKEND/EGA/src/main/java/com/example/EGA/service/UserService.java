package com.example.EGA.service;


import com.example.EGA.dto.AuthRequestDTO;
import com.example.EGA.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User saveUser(User user);
    void register(User user);
    User login(AuthRequestDTO request);
}

