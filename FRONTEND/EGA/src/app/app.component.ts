import { Component, computed, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/components/layout/sidebar.component';
import { ClientSidebarComponent } from './shared/components/layout/client-sidebar.component';
import { AdminNavbarComponent } from './shared/components/admin-navbar/admin-navbar.component';
import { SidebarService } from './core/services/sidebar.service';
import { TokenService } from './core/services/token.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ClientSidebarComponent, AdminNavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  // ✅ Signal qui contient l'URL courante, initialisé avec une valeur par défaut
  currentUrl = signal('/');

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private tokenService: TokenService
  ) {
    // Initialiser avec l'URL actuelle
    this.currentUrl.set(this.router.url);
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  isCollapsed = computed(() => this.sidebarService.isCollapsed());

  // ✅ Computed RÉACTIF
  isPublicRoute = computed(() => {
    const url = this.currentUrl();
    return url === '/login' || url === '/register';
  });

  // Vérifier le rôle de l'utilisateur
  isClient = computed(() => this.tokenService.hasRole('CLIENT') || this.tokenService.hasRole('USER'));
  isAdmin = computed(() => this.tokenService.hasRole('ADMIN'));
  isAgent = computed(() => this.tokenService.hasRole('AGENT'));
}
