import { Injectable } from '@angular/core';
import { User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Stocker les informations utilisateur
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Récupérer les informations utilisateur
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Stocker le token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Récupérer le rôle
  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Vérifier le rôle
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  // Vérifier si l'utilisateur a l'un des rôles
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Effacer les données de l'utilisateur
  clear(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
