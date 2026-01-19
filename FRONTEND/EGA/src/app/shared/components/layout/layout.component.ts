import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';
import { ClientNavbarComponent } from '../client-navbar/client-navbar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientNavbarComponent, AdminNavbarComponent],
  template: `
    <div>
      <!-- Navbar spécifique selon le rôle -->
      <app-client-navbar *ngIf="isClient()"></app-client-navbar>
      <app-admin-navbar *ngIf="isAdmin()"></app-admin-navbar>
      
      <!-- Contenu principal -->
      <div class="container-fluid mt-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class LayoutComponent {

  constructor(private tokenService: TokenService) {}

  isClient(): boolean {
    return this.tokenService.hasRole('CLIENT');
  }

  isAdmin(): boolean {
    return this.tokenService.hasRole('ADMIN');
  }
}
