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
  form = { compteId: 0, montant: 0 };
  msg = '';

  constructor(private tx: TransactionService) {}

  retirer() {
    this.tx.retrait(this.form).subscribe({
      next: () => this.msg = "Retrait réussi !",
      error: () => this.msg = "Solde insuffisant !"
    });
  }
}
