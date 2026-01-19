import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CompteService } from '../../../core/services/compte.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Compte } from '../../../shared/models/compte.model';
import { Transaction } from '../../../shared/models/transaction.model';
import {ClientSidebarComponent} from '../../../shared/components/layout/client-sidebar.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, ClientSidebarComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  loading = false;
  selectedCompte: Compte | null = null;

  // Statistiques calculées
  get totalSolde(): number {
    return this.comptes.reduce((total, compte) => total + compte.solde, 0);
  }

  get totalTransactions(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateTransaction || new Date());
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    }).length;
  }

  constructor(
    private authService: AuthService,
    private compteService: CompteService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadComptes();
  }

  loadComptes() {
    this.loading = true;
    this.compteService.getComptes().subscribe({
      next: (comptes: Compte[]) => {
        this.comptes = comptes;
        this.loading = false;
        if (comptes.length > 0) {
          this.selectedCompte = comptes[0];
          this.loadTransactions(comptes[0].id!);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.loading = false;
      }
    });
  }

  loadTransactions(compteId: number) {
    // Pour les clients, on récupère l'historique des 30 derniers jours
    const dateFin = new Date();
    const dateDebut = new Date();
    dateDebut.setDate(dateFin.getDate() - 30);

    const debutStr = dateDebut.toISOString().split('T')[0];
    const finStr = dateFin.toISOString().split('T')[0];

    this.transactionService.getHistorique(compteId, debutStr, finStr).subscribe({
      next: (transactions: Transaction[]) => {
        this.transactions = transactions;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des transactions:', error);
      }
    });
  }

  onCompteChange(compte: Compte) {
    this.selectedCompte = compte;
    this.loadTransactions(compte.id!);
  }

  generateReleve(compteId: number) {
    // Pour les clients, on génère le relevé des 30 derniers jours
    const dateFin = new Date();
    const dateDebut = new Date();
    dateDebut.setDate(dateFin.getDate() - 30);

    const debutStr = dateDebut.toISOString().split('T')[0];
    const finStr = dateFin.toISOString().split('T')[0];

    this.transactionService.downloadRelevePDF(compteId, debutStr, finStr).subscribe({
      next: (blob: Blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_compte_${this.selectedCompte?.numeroCompte}_${debutStr}_${finStr}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erreur lors de la génération du relevé:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}