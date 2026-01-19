import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
    [key: string]: any;
  };
}

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

  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) {}

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
        
        // Stocker le token et les informations utilisateur
        if (res.token) {
          this.tokenService.setToken(res.token);
          
          // Extraire les informations utilisateur du token ou de la réponse
          const user = res.user || { email: this.email, role: 'AGENT' }; // Par défaut AGENT
          this.tokenService.setUser(user);
          
          console.log('💾 Token et utilisateur stockés:', user);
          
          // Rediriger selon le rôle
          this.redirectBasedOnRole(user.role);
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
  
  private redirectBasedOnRole(role: string) {
    console.log('🔄 Redirection selon le rôle:', role);
    
    switch (role.toUpperCase()) {
      case 'ADMIN':
        console.log('👑 Redirection vers admin');
        this.router.navigate(['/admin']);
        break;
      case 'AGENT':
        console.log('👨‍💼 Redirection vers home (agent)');
        this.router.navigate(['/home']);
        break;
      case 'CLIENT':
      case 'USER':
        console.log('👤 Redirection vers client dashboard');
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        console.log('❓ Rôle inconnu, redirection vers home');
        this.router.navigate(['/']);
        break;
    }
  }
  
  // Méthode optionnelle pour navigation programmatique
  goToRegister() {
    this.router.navigate(['/register']);
  }
}