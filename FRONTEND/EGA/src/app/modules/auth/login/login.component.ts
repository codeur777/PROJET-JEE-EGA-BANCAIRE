import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Validation
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    console.log('📧 Tentative de connexion:', this.email);
    
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        
        console.log('✅ Réponse du serveur:', res);
        console.log('🔑 Token reçu:', res.token ? 'OUI' : 'NON');
        
        // Stocker le token
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', this.email);
          
          console.log('💾 Token stocké, redirection vers /home...');
          
          // Rediriger vers home (pas dashboard car la route n'existe pas)
          this.router.navigate(['/home']).then(success => {
            console.log('🚀 Redirection:', success ? 'RÉUSSIE' : 'ÉCHOUÉE');
          });
        } else {
          console.error('❌ Pas de token dans la réponse');
          this.errorMessage = "Erreur : Token manquant";
        }
      },
      error: (err) => {
        this.loading = false;
        
        console.error('❌ Erreur complète:', err);
        console.error('📦 err.error:', err.error);
        console.error('💬 Message:', err.error?.message);
        
        // Extraction intelligente du message d'erreur
        let errorMsg = '';
        
        if (err.error && err.error.message) {
          // Message du backend (format JSON)
          errorMsg = err.error.message;
        } else if (typeof err.error === 'string') {
          // Message en texte brut
          errorMsg = err.error;
        } else if (err.status === 401) {
          errorMsg = "Email ou mot de passe incorrect";
        } else if (err.status === 400) {
          errorMsg = "Requête invalide. Vérifiez vos informations.";
        } else if (err.status === 0) {
          errorMsg = "Le serveur ne répond pas. Vérifiez votre connexion.";
        } else if (err.status === 500) {
          errorMsg = "Erreur serveur. Réessayez plus tard.";
        } else {
          errorMsg = "Une erreur est survenue lors de la connexion.";
        }
        
        this.errorMessage = errorMsg;
        console.log('📢 Message affiché:', this.errorMessage);
      }
    });
  }
  
  // Méthode optionnelle pour navigation programmatique
  goToRegister() {
    this.router.navigate(['/register']);
  }
}