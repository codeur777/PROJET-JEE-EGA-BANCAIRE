import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-client-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.css']
})
export class ClientSidebarComponent {
  constructor(private sidebarService: SidebarService) {}

  get isCollapsed() {
    return this.sidebarService.isCollapsed;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}