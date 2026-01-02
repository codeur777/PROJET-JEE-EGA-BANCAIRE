import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  currentFilter: string = 'ALL';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
  this.clientService.getClients().subscribe({
    next: (data: Client[]) => {
      this.clients = data.map(c => ({
        ...c,
        statut: c.statut ?? 'ACTIF',
        dateInscription: c.dateInscription ?? new Date()
      }));

      this.filteredClients = [...this.clients];
      this.filterClients(); // 🔥 FIX
    },
    error: (err) => {
      console.error('Erreur lors du chargement des clients:', err);
      alert('Erreur lors du chargement des clients');
    }
  });
}


  filterClients() {
    this.filteredClients = this.clients.filter(c => {
      const matchesSearch = 
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.telephone.includes(this.searchTerm);
      
      const matchesStatus = 
        this.currentFilter === 'ALL' || 
        c.statut === this.currentFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.currentPage = 1;
  }

  filterByStatus(status: string) {
    this.currentFilter = status;
    this.filterClients();
  }

  deleteClient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          alert('Client supprimé avec succès');
          this.loadClients();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  // Statistics
  getActiveClients(): number {
    return this.clients.filter(c => c.statut === 'ACTIF').length;
  }

  getInactiveClients(): number {
    return this.clients.filter(c => c.statut === 'INACTIF').length;
  }

  getNewClients(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.clients.filter(c => {
      const inscriptionDate = new Date(c.dateInscription || new Date());
      return inscriptionDate >= oneMonthAgo;
    }).length;
  }

  // Pagination
  getTotalPages(): number {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Export functions (à implémenter avec des bibliothèques)
  exportToExcel() {
    alert('Export Excel en cours de développement...');
  }

  exportToPDF() {
    alert('Export PDF en cours de développement...');
  }
}