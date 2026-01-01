import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { 
    fullname: '', 
    email: '', 
    password: '' 
  };
  
  confirmPassword = '';
  acceptTerms = false;
  message = '';
  isError = false;
  loading = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  register() {
    // Validation supplémentaire
    if (this.user.password !== this.confirmPassword) {
      this.showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!this.acceptTerms) {
      this.showError('Vous devez accepter les conditions générales');
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.isError = false;
        this.message = "Compte créé avec succès ! Redirection...";
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de l\'inscription:', err);
        
        if (err.status === 409) {
          this.showError('Cet email est déjà utilisé');
        } else {
          this.showError('Échec de l\'inscription. Veuillez réessayer.');
        }
      }
    });
  }

  checkPasswordStrength() {
    const password = this.user.password;
    
    if (!password) {
      this.passwordStrength = 'weak';
      return;
    }

    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Contient des chiffres
    if (/\d/.test(password)) strength++;
    
    // Contient des majuscules et minuscules
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    
    // Contient des caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  showError(msg: string) {
    this.isError = true;
    this.message = msg;
  }
}