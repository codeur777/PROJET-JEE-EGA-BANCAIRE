import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../core/services/compte.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ClientService } from '../../core/services/client.service';
import { Compte } from '../../shared/models/compte.model';
import { Transaction } from '../../shared/models/transaction.model';
import { Client } from '../../shared/models/client.model';

@Component({
  selector: 'app-releve',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './releve.component.html',
  styleUrls: ['./releve.component.css']
})
export class ReleveComponent implements OnInit {
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  selectedCompte?: Compte;
  selectedClient?: Client;
  showPreview: boolean = false;
  loading: boolean = false;
  
  today: Date = new Date();
  
  filters = {
    compteId: '',
    dateDebut: '',
    dateFin: '',
    format: 'PDF'
  };

  constructor(
    private compteService: CompteService,
    private transactionService: TransactionService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadComptes();
    this.initializeDates();
  }

  initializeDates() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filters.dateFin = this.formatDate(today);
    this.filters.dateDebut = this.formatDate(firstDayOfMonth);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadComptes() {
    this.compteService.getComptes().subscribe({
      next: (data: Compte[]) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        alert('Erreur lors du chargement des comptes');
      }
    });
  }

  generateReleve() {
    if (!this.filters.compteId || !this.filters.dateDebut || !this.filters.dateFin) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.loading = true;

    // Charger le compte sélectionné
    this.compteService.getById(Number(this.filters.compteId)).subscribe({
      next: (compte: Compte) => {
        this.selectedCompte = compte;

        // Charger le client associé
        if (compte.clientId) {
          this.clientService.getClientById(compte.clientId).subscribe({
              next: (client: Client) => {
              this.selectedClient = client;
            },
            error: (err) => {
              console.error('Erreur lors du chargement du client:', err);
              // Continuer même si le client n'est pas trouvé
              this.selectedClient = {
                id: compte.clientId || 0,
                nom: 'Client',
                prenom: 'Inconnu',
                email: 'inconnu@email.com',
                telephone: 'N/A',
                adresse: 'N/A'
              };
            }
          });
        } else {
          // Si pas de clientId, créer un client fictif
          this.selectedClient = {
            id: 0,
            nom: 'Client',
            prenom: 'Inconnu',
            email: 'inconnu@email.com',
            telephone: 'N/A',
            adresse: 'N/A'
          };
        }

        // Charger les transactions
        this.transactionService.getHistorique(
          Number(this.filters.compteId),
          this.filters.dateDebut,
          this.filters.dateFin
        ).subscribe({
          next: (transactions: Transaction[]) => {
            this.transactions = transactions.sort((a, b) => {
              return new Date(a.dateTransaction!).getTime() - new Date(b.dateTransaction!).getTime();
            });
            this.showPreview = true;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des transactions:', err);
            alert('Erreur lors du chargement des transactions');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compte:', err);
        alert('Erreur lors du chargement du compte');
        this.loading = false;
      }
    });
  }

  resetFilters() {
    this.initializeDates();
    this.filters.compteId = '';
    this.filters.format = 'PDF';
    this.showPreview = false;
  }

  printReleve() {
    window.print();
  }

  downloadReleve() {
    if (this.filters.format === 'PDF') {
      this.downloadRelevePDF();
    }
  }

  downloadRelevePDF() {
    if (!this.selectedCompte) {
      alert('Veuillez d\'abord générer le relevé');
      return;
    }

    // Afficher un message d'attente
    const loadingMessage = 'Génération du PDF en cours... Cela peut prendre quelques secondes.';
    alert(loadingMessage);

    this.loading = true;

    this.transactionService.downloadRelevePDF(
      Number(this.filters.compteId),
      this.filters.dateDebut,
      this.filters.dateFin
    ).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${this.selectedCompte?.numeroCompte}_${new Date().getTime()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
        alert('PDF téléchargé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF:', err);
        alert('Erreur lors de la génération du PDF: ' + err.message);
        this.loading = false;
      }
    });
  }

  getLibelle(tx: Transaction): string {
    const type = tx.typeTransaction || tx.type;
    switch (type) {
      case 'DEPOT':
        return 'Dépôt sur compte';
      case 'RETRAIT':
        return 'Retrait d\'espèces';
      case 'VIREMENT':
        if (tx.compteSourceId === Number(this.filters.compteId)) {
          return `Virement vers compte ${tx.compteDestinationId}`;
        } else {
          return `Virement depuis compte ${tx.compteSourceId}`;
        }
      default:
        return 'Opération bancaire';
    }
  }

  isDebit(tx: Transaction): boolean {
    const type = tx.typeTransaction || tx.type;
    if (type === 'RETRAIT') return true;
    if (type === 'VIREMENT' && tx.compteSourceId === Number(this.filters.compteId)) return true;
    return false;
  }

  calculateSolde(index: number): number {
    if (!this.selectedCompte) return 0;
    
    let solde = this.selectedCompte.solde;
    
    for (let i = this.transactions.length - 1; i > index; i--) {
      const tx = this.transactions[i];
      if (this.isDebit(tx)) {
        solde += tx.montant;
      } else {
        solde -= tx.montant;
      }
    }
    
    return solde;
  }

  getTotalCredits(): number {
    return this.transactions
      .filter(tx => !this.isDebit(tx))
      .reduce((sum, tx) => sum + tx.montant, 0);
  }

  getTotalDebits(): number {
    return this.transactions
      .filter(tx => this.isDebit(tx))
      .reduce((sum, tx) => sum + tx.montant, 0);
  }

  generateReleveNumber(): string {
    const date = new Date();
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
  }
}