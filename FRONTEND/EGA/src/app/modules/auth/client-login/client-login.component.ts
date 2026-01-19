import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const { email, password } = this.loginForm.value;

      this.authService.clientLogin(email, password).subscribe({
        next: (response: any) => {
          this.loading = false;
          
          // Stocker le token et les informations utilisateur
          if (response.token) {
            this.tokenService.setToken(response.token);
            
            // Extraire les informations utilisateur du token ou de la réponse
            const user = response.user || { email: email, role: 'CLIENT' };
            this.tokenService.setUser(user);
          }
          
          // Rediriger vers le dashboard client
          this.router.navigate(['/client/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Erreur de connexion';
        }
      });
    } else {
      this.error = 'Veuillez remplir tous les champs correctement';
    }
  }

  goToAgentLogin() {
    this.router.navigate(['/auth/login']);
  }
}