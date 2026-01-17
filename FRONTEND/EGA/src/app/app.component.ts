import { Component, computed, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/components/layout/sidebar.component';
import { SidebarService } from './core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  // ✅ Signal qui contient l’URL courante, initialisé avec une valeur par défaut
  currentUrl = signal('/');

  constructor(
    private sidebarService: SidebarService,
    private router: Router
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
}
