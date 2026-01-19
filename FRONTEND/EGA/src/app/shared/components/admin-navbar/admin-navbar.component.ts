import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-crown"></i> EGA Bank - Administration
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" routerLink="/admin" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i> Tableau de Bord
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-warning" (click)="logout()" style="cursor: pointer;">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
    .navbar-brand {
      font-weight: bold;
      font-size: 1.3rem;
    }
    .nav-link.active {
      border-bottom: 3px solid #fff;
    }
  `]
})
export class AdminNavbarComponent {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
