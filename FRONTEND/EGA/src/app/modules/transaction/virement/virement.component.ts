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
  data = { source: 0, destination: 0, montant: 0 };
  result = '';

  constructor(private tx: TransactionService) {}

  virer() {
    this.tx.virement(this.data).subscribe({
      next: () => this.result = "Virement effectué !",
      error: () => this.result = "Erreur lors du virement"
    });
  }
}
