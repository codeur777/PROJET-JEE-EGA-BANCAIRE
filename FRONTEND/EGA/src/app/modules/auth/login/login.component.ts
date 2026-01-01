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
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('✅ Connexion réussie:', res);
        
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', this.email);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Détails de l\'erreur:', err);
        
        // Extraction du message : on cherche dans err.error.message (JSON envoyé par Spring)
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 401) {
          this.errorMessage = "Email ou mot de passe incorrect";
        } else if (err.status === 400) {
          this.errorMessage = "Requête invalide. Vérifiez vos informations.";
        } else if (err.status === 0) {
          this.errorMessage = "Le serveur ne répond pas. Vérifiez votre connexion.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de la connexion.";
        }
      }
    });
  }
}