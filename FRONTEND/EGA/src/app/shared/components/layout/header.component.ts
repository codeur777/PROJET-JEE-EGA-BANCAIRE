import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user = localStorage.getItem('user') || 'Utilisateur';
  logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}
