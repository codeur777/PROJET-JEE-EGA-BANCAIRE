package com.example.EGA.config;

import com.example.EGA.service.ClientAuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ClientJwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final ClientAuthService clientAuthService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtUtils.extractUsername(jwt);
            String role = jwtUtils.extractRole(jwt);

            if (userEmail != null && "CLIENT".equals(role) && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Pour les clients, on crée une authentification spéciale
                Long clientId = jwtUtils.extractClientId(jwt);

                if (clientId != null && !jwtUtils.isTokenExpired(jwt)) {
                    // Créer une authentification pour le client
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail, null, java.util.Collections.singletonList(() -> "ROLE_CLIENT"));
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token invalide, continuer sans authentification
        }

        filterChain.doFilter(request, response);
    }
}