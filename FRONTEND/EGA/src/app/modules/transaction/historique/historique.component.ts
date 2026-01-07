import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  numeroCompte = '';
  compteInfo: any = null;
  debut = '';
  fin = '';
  historique: any[] = [];
  filteredHistorique: any[] = [];
  isLoading = false;
  isLoadingCompte = false;
  
  // Filtres
  filterType = 'TOUS';
  searchText = '';
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    // Set default dates (last 30 days)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    
    this.debut = this.formatDate(lastMonth);
    this.fin = this.formatDate(today);
  }

  onNumeroCompteChange() {
    if (this.numeroCompte.trim().length > 0) {
      this.isLoadingCompte = true;
      this.txService.getClientInfoByNumeroCompte(this.numeroCompte).subscribe({
        next: (data: any) => {
          this.compteInfo = data;
          this.isLoadingCompte = false;
        },
        error: () => {
          this.compteInfo = null;
          this.isLoadingCompte = false;
        }
      });
    } else {
      this.compteInfo = null;
    }
  }

  loadHistorique() {
    if (!this.compteInfo || !this.debut || !this.fin) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading = true;
    this.txService.getHistorique(this.compteInfo.compteId, this.debut, this.fin).subscribe({
      next: (data) => {
        this.historique = data;
        this.applyFilters();
        this.calculatePages();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.historique = [];
        this.filteredHistorique = [];
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.historique];
    
    // Filtrer par type
    if (this.filterType !== 'TOUS') {
      filtered = filtered.filter(t => t.typeTransaction === this.filterType);
    }
    
    // Filtrer par recherche texte
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(t => 
        (t.compte?.numeroCompte?.toLowerCase().includes(search)) ||
        (t.compteDestinataire?.numeroCompte?.toLowerCase().includes(search)) ||
        (t.montant.toString().includes(search))
      );
    }
    
    this.filteredHistorique = filtered;
    this.currentPage = 1;
    this.calculatePages();
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.filteredHistorique.length / this.itemsPerPage);
  }

  get paginatedHistorique() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredHistorique.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getTotal(): number {
    return this.filteredHistorique.reduce((sum, transaction) => {
      return sum + (transaction.montant || 0);
    }, 0);
  }

  getDepotTotal(): number {
    return this.filteredHistorique
      .filter(t => t.typeTransaction === 'DEPOT')
      .reduce((sum, t) => sum + (t.montant || 0), 0);
  }

  getRetraitTotal(): number {
    return this.filteredHistorique
      .filter(t => t.typeTransaction === 'RETRAIT')
      .reduce((sum, t) => sum + (t.montant || 0), 0);
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'VIREMENT': 'Virement'
    };
    return labels[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      'DEPOT': '📥',
      'RETRAIT': '📤',
      'VIREMENT': '🔁'
    };
    return icons[type] || '📄';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}