import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private tokenService: TokenService
  ) {}

  login(email: string, password: string) {
    console.log('📩 Envoi de la requête:', email, password);
    
    // ✅ CORRECTION : Envoyer "email" au lieu de "username"
    return this.http.post(`${this.api}/login`, {
      email: email,        // ← Backend attend "email"
      password: password
    });
  }

  clientLogin(email: string, password: string) {
    console.log('📩 Envoi de la requête client login:', email, password);

    return this.http.post(`${this.api}/client/login`, {
      email: email,
      password: password
    });
  }

  register(data: any) {
    // Le backend utilise email comme username, pas besoin d'envoyer username
    const registerData = {
      email: data.email,
      password: data.password
    };
    
    console.log('📝 Données d\'inscription:', registerData);
    return this.http.post(`${this.api}/register`, registerData);
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }

  // Récupérer le rôle de l'utilisateur actuellement connecté
  getCurrentRole(): string | null {
    return this.tokenService.getRole();
  }

  // Récupérer l'utilisateur actuellement connecté
  getCurrentUser() {
    return this.tokenService.getUser();
  }

  // Vérifier si authentifié
  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }
}