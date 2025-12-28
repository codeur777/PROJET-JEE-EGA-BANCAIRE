import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../shared/models/transaction.model';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, FormsModule, CardComponent, DatePipe],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  historique: Transaction[] = [];
  compteId: number = 1; // default
  debut: string = '2023-01-01';
  fin: string = '2025-12-31';

  constructor(private tx: TransactionService) {}

  ngOnInit() {
    this.loadHistorique();
  }

  loadHistorique() {
    this.tx.getHistorique(this.compteId, this.debut, this.fin).subscribe((res: Transaction[]) => this.historique = res);
  }
}
