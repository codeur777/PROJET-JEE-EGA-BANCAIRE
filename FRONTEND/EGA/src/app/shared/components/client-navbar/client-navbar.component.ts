import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-piggy-bank"></i> EGA Bank - Client
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/client/dashboard" routerLinkActive="active">
                <i class="fas fa-home"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/compte" routerLinkActive="active">
                <i class="fas fa-credit-card"></i> Mes Comptes
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="transactionDropdown" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-exchange-alt"></i> Transactions
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" routerLink="/transaction/depot">
                  <i class="fas fa-arrow-down"></i> Dépôt
                </a></li>
                <li><a class="dropdown-item" routerLink="/transaction/retrait">
                  <i class="fas fa-arrow-up"></i> Retrait
                </a></li>
                <li><a class="dropdown-item" routerLink="/transaction/virement">
                  <i class="fas fa-exchange-alt"></i> Virement
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" routerLink="/transaction/historique">
                  <i class="fas fa-history"></i> Historique
                </a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/releve" routerLinkActive="active">
                <i class="fas fa-file-pdf"></i> Relevés
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
export class ClientNavbarComponent {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
