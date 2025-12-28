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
  form = { compteId: 0, montant: 0 };
  message = '';

  constructor(private txService: TransactionService) {}

  depot() {
    this.txService.depot(this.form).subscribe({
      next: () => this.message = "Dépôt effectué !",
      error: () => this.message = "Erreur lors du dépôt"
    });
  }
}
