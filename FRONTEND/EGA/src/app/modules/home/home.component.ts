import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/layout/header.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './home.components.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
