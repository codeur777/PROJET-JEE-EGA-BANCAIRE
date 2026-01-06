import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-depot',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent {
  form = { numeroCompte: '', montant: 0 };
  compteInfo: any = null;
  message = '';
  isLoading = false;
  isSubmitting = false;

  constructor(private txService: TransactionService) {}

  onNumeroCompteChange() {
    if (this.form.numeroCompte.trim().length > 0) {
      this.isLoading = true;
      this.txService.getClientInfoByNumeroCompte(this.form.numeroCompte).subscribe({
        next: (data: any) => {
          if (data) {
            this.compteInfo = data;
            this.message = '';
          } else {
            this.compteInfo = null;
            this.message = "❌ Compte introuvable. Vérifiez le numéro.";
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.compteInfo = null;
          this.message = "❌ Erreur lors de la recherche du compte. Vérifiez le numéro.";
          this.isLoading = false;
        }
      });
    } else {
      this.compteInfo = null;
      this.message = '';
    }
  }

  depot() {
    if (!this.compteInfo) {
      this.message = "❌ Veuillez d'abord rechercher un compte valide";
      return;
    }

    if (this.form.montant <= 0) {
      this.message = "❌ Le montant doit être supérieur à 0";
      return;
    }

    const transactionData = {
      compteId: this.compteInfo.compteId,
      montant: this.form.montant
    };

    this.isSubmitting = true;
    this.message = '';
    
    this.txService.depot(transactionData).subscribe({
      next: (response: string) => {
        this.message = response;
        this.form.montant = 0;
        this.isSubmitting = false;
        
        // Mettre à jour le solde affiché
        if (this.compteInfo) {
          this.compteInfo.solde += transactionData.montant;
        }
        
        setTimeout(() => this.message = '', 5000);
      },
      error: (err) => {
        this.message = "❌ Erreur : " + err.message;
        this.isSubmitting = false;
        setTimeout(() => this.message = '', 5000);
      }
    });
  }
}