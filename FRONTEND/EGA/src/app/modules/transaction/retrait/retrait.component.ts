import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-retrait',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './retrait.component.html',
  styleUrls: ['./retrait.component.css']
})
export class RetraitComponent {
  form = { numeroCompte: '', montant: 0 };
  compteInfo: any = null;
  msg = '';
  isLoading = false;

  constructor(private tx: TransactionService) {}

  onNumeroCompteChange() {
    if (this.form.numeroCompte.trim().length > 0) {
      this.isLoading = true;
      this.tx.getClientInfoByNumeroCompte(this.form.numeroCompte).subscribe({
        next: (data: any) => {
          this.compteInfo = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.compteInfo = null;
          this.msg = "❌ Compte introuvable";
          this.isLoading = false;
          setTimeout(() => this.msg = '', 3000);
        }
      });
    } else {
      this.compteInfo = null;
    }
  }

  retirer() {
    if (!this.compteInfo) {
      this.msg = "❌ Veuillez d'abord rechercher un compte valide";
      return;
    }

    if (this.form.montant <= 0) {
      this.msg = "❌ Le montant doit être supérieur à 0";
      return;
    }

    if (this.form.montant > this.compteInfo.solde) {
      this.msg = "❌ Solde insuffisant pour ce retrait";
      return;
    }

    const transactionData = {
      compteId: this.compteInfo.compteId,
      montant: this.form.montant
    };

    this.tx.retrait(transactionData).subscribe({
      next: () => {
        this.msg = "✅ Retrait effectué avec succès !";
        this.form.montant = 0;
        setTimeout(() => this.msg = '', 3000);
      },
      error: (err) => {
        this.msg = "❌ Erreur lors du retrait : " + (err.error?.message || 'Solde insuffisant !');
      }
    });
  }
}