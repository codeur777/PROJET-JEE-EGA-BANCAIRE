import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    console.log('📩 Envoi de la requête:', email, password);
    
    // ✅ CORRECTION : Envoyer "email" au lieu de "username"
    return this.http.post(`${this.api}/login`, {
      email: email,        // ← Backend attend "email"
      password: password
    });
  }

  register(data: any) {
    // S'assurer que username est défini (peut être l'email par défaut)
    const registerData = {
      username: data.fullname || data.email,  // Utiliser fullname comme username
      email: data.email,
      password: data.password
    };
    
    console.log('📝 Données d\'inscription:', registerData);
    return this.http.post(`${this.api}/register`, registerData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}