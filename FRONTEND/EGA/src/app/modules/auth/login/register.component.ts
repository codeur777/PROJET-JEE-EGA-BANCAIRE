import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { fullname: '', email: '', password: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.message = "Compte créé avec succès !";
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => this.message = "Échec de l'inscription"
    });
  }
}
