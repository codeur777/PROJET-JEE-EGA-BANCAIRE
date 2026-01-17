import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule
  ],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private sidebarService: SidebarService) {}

  get isCollapsed() {
    return this.sidebarService.isCollapsed;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
