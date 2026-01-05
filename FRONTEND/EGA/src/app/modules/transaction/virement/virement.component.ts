import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-virement',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './virement.component.html',
  styleUrls: ['./virement.component.css']
})
export class VirementComponent {
  data = { sourceNumero: '', destNumero: '', montant: 0 };
  sourceInfo: any = null;
  destInfo: any = null;
  result = '';
  isLoadingSource = false;
  isLoadingDest = false;

  constructor(private tx: TransactionService) {}

  onSourceChange() {
    if (this.data.sourceNumero.trim().length > 0) {
      this.isLoadingSource = true;
      this.tx.getClientInfoByNumeroCompte(this.data.sourceNumero).subscribe({
        next: (data: any) => {
          this.sourceInfo = data;
          this.isLoadingSource = false;
        },
        error: (err) => {
          this.sourceInfo = null;
          this.result = "❌ Compte source introuvable";
          this.isLoadingSource = false;
          setTimeout(() => this.result = '', 3000);
        }
      });
    } else {
      this.sourceInfo = null;
    }
  }

  onDestChange() {
    if (this.data.destNumero.trim().length > 0) {
      this.isLoadingDest = true;
      this.tx.getClientInfoByNumeroCompte(this.data.destNumero).subscribe({
        next: (data: any) => {
          this.destInfo = data;
          this.isLoadingDest = false;
        },
        error: (err) => {
          this.destInfo = null;
          this.result = "❌ Compte destination introuvable";
          this.isLoadingDest = false;
          setTimeout(() => this.result = '', 3000);
        }
      });
    } else {
      this.destInfo = null;
    }
  }

  virer() {
    if (!this.sourceInfo || !this.destInfo) {
      this.result = "❌ Veuillez rechercher les deux comptes";
      return;
    }

    if (this.sourceInfo.compteNumero === this.destInfo.compteNumero) {
      this.result = "❌ Les comptes source et destination doivent être différents";
      return;
    }

    if (this.data.montant <= 0) {
      this.result = "❌ Le montant doit être supérieur à 0";
      return;
    }

    if (this.data.montant > this.sourceInfo.solde) {
      this.result = "❌ Solde insuffisant sur le compte source";
      return;
    }

    const transactionData = {
      source: this.sourceInfo.compteId,
      destination: this.destInfo.compteId,
      montant: this.data.montant
    };

    this.tx.virement(transactionData).subscribe({
      next: () => {
        this.result = "✅ Virement effectué avec succès !";
        this.data.montant = 0;
        setTimeout(() => this.result = '', 3000);
      },
      error: (err) => {
        this.result = "❌ Erreur lors du virement : " + (err.error?.message || 'Veuillez réessayer');
      }
    });
  }
}