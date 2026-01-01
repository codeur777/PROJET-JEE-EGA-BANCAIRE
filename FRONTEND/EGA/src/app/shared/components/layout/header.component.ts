import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  user = localStorage.getItem('user') || 'Utilisateur';
  logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}
