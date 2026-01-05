import { Component } from '@angular/core';
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
export class HistoriqueComponent {
  numeroCompte = '';
  compteInfo: any = null;
  debut = '';
  fin = '';
  historique: any[] = [];
  isLoading = false;
  isLoadingCompte = false;

  constructor(private txService: TransactionService) {}

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
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.historique = [];
        this.isLoading = false;
      }
    });
  }

  getTotal(): number {
    return this.historique.reduce((sum, transaction) => {
      return sum + (transaction.montant || 0);
    }, 0);
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'VIREMENT': 'Virement'
    };
    return labels[type] || type;
  }
}