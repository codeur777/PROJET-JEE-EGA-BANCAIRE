import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClientService } from '../../core/services/client.service';
import { CompteService } from '../../core/services/compte.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AdminService } from '../../core/services/admin.service';
import { Client } from '../../shared/models/client.model';
import { Compte } from '../../shared/models/compte.model';
import { User } from '../../shared/models/user.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('accountTypeChart') accountTypeChart!: ElementRef;
  @ViewChild('clientStatusChart') clientStatusChart!: ElementRef;
  @ViewChild('balanceEvolutionChart') balanceEvolutionChart!: ElementRef;
  @ViewChild('monthlyStatsChart') monthlyStatsChart!: ElementRef;

  private charts: { [key: string]: Chart } = {};

  // Statistiques
  stats = {
    totalClients: 0,
    totalComptes: 0,
    totalTransactions: 0,
    totalAgents: 0,
    soldeTotal: 0,
    clientsActifs: 0,
    clientsInactifs: 0,
    comptesCourants: 0,
    comptesEpargne: 0
  };

  // Données
  clients: Client[] = [];
  agents: User[] = [];
  comptes: Compte[] = [];

  // États de chargement
  loading = {
    stats: false,
    clients: false,
    agents: false,
    comptes: false
  };

  // États d'affichage
  activeTab: 'dashboard' | 'clients' | 'agents' | 'comptes' = 'dashboard';

  // Nouveau agent
  newAgent = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  showCreateAgentForm = false;
  creatingAgent = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadClients();
    this.loadAgents();
    this.loadComptes();
  }

  ngAfterViewInit() {
    // Attendre que les données soient chargées avant de créer les graphiques
    setTimeout(() => {
      this.createCharts();
    }, 1000);
  }

  // Chargement des statistiques
  loadStats() {
    this.loading.stats = true;

    Promise.all([
      this.clientService.getClients().toPromise(),
      this.compteService.getComptes().toPromise(),
      this.adminService.getAllAgents().toPromise()
    ]).then(([clients, comptes, agents]) => {
      this.stats.totalClients = clients?.length || 0;
      this.stats.totalComptes = comptes?.length || 0;
      this.stats.totalAgents = agents?.length || 0;
      this.stats.soldeTotal = comptes?.reduce((sum: number, compte: Compte) => sum + (compte.solde || 0), 0) || 0;
      this.stats.totalTransactions = this.stats.totalComptes * 5;

      // Statistiques détaillées
      this.stats.clientsActifs = clients?.filter((c: Client) => c.statut === 'ACTIF').length || 0;
      this.stats.clientsInactifs = clients?.filter((c: Client) => c.statut !== 'ACTIF').length || 0;
      this.stats.comptesCourants = comptes?.filter((c: Compte) => c.typeCompte === 'COURANT').length || 0;
      this.stats.comptesEpargne = comptes?.filter((c: Compte) => c.typeCompte === 'EPARGNE').length || 0;

      this.loading.stats = false;
      
      // Créer les graphiques après le chargement des données
      setTimeout(() => this.createCharts(), 100);
    }).catch(error => {
      console.error('Erreur lors du chargement des statistiques:', error);
      this.loading.stats = false;
    });
  }

  loadClients() {
    this.loading.clients = true;
    this.clientService.getClients().subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        this.loading.clients = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.loading.clients = false;
      }
    });
  }

  loadAgents() {
    this.loading.agents = true;
    this.adminService.getAllAgents().subscribe({
      next: (agents: User[]) => {
        this.agents = agents;
        this.loading.agents = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des agents:', error);
        this.loading.agents = false;
      }
    });
  }

  loadComptes() {
    this.loading.comptes = true;
    this.compteService.getComptes().subscribe({
      next: (comptes: Compte[]) => {
        this.comptes = comptes;
        this.loading.comptes = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.loading.comptes = false;
      }
    });
  }

  // Création des graphiques
  createCharts() {
    if (this.activeTab === 'dashboard') {
      this.createAccountTypeChart();
      this.createClientStatusChart();
      this.createBalanceEvolutionChart();
      this.createMonthlyStatsChart();
    }
  }

  createAccountTypeChart() {
    if (!this.accountTypeChart) return;

    const ctx = this.accountTypeChart.nativeElement.getContext('2d');
    
    if (this.charts['accountType']) {
      this.charts['accountType'].destroy();
    }

    this.charts['accountType'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Comptes Courants', 'Comptes Épargne'],
        datasets: [{
          data: [this.stats.comptesCourants, this.stats.comptesEpargne],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(17, 153, 142, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(17, 153, 142, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, weight: 'bold' },
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Répartition des Types de Comptes',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  createClientStatusChart() {
    if (!this.clientStatusChart) return;

    const ctx = this.clientStatusChart.nativeElement.getContext('2d');
    
    if (this.charts['clientStatus']) {
      this.charts['clientStatus'].destroy();
    }

    this.charts['clientStatus'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Clients Actifs', 'Clients Inactifs'],
        datasets: [{
          data: [this.stats.clientsActifs, this.stats.clientsInactifs],
          backgroundColor: [
            'rgba(56, 239, 125, 0.8)',
            'rgba(245, 87, 108, 0.8)'
          ],
          borderColor: [
            'rgba(56, 239, 125, 1)',
            'rgba(245, 87, 108, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, weight: 'bold' },
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Statut des Clients',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  createBalanceEvolutionChart() {
    if (!this.balanceEvolutionChart) return;

    const ctx = this.balanceEvolutionChart.nativeElement.getContext('2d');
    
    if (this.charts['balanceEvolution']) {
      this.charts['balanceEvolution'].destroy();
    }

    // Données simulées pour l'évolution du solde total
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const balances = months.map((_, i) => this.stats.soldeTotal * (0.7 + (i * 0.05)));

    this.charts['balanceEvolution'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Solde Total (€)',
          data: balances,
          borderColor: 'rgba(102, 126, 234, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' }
            }
          },
          title: {
            display: true,
            text: 'Évolution du Solde Total',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatCurrency(Number(value))
            }
          }
        }
      }
    });
  }

  createMonthlyStatsChart() {
    if (!this.monthlyStatsChart) return;

    const ctx = this.monthlyStatsChart.nativeElement.getContext('2d');
    
    if (this.charts['monthlyStats']) {
      this.charts['monthlyStats'].destroy();
    }

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    
    this.charts['monthlyStats'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Nouveaux Clients',
            data: months.map(() => Math.floor(Math.random() * 20) + 5),
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
          },
          {
            label: 'Nouveaux Comptes',
            data: months.map(() => Math.floor(Math.random() * 30) + 10),
            backgroundColor: 'rgba(17, 153, 142, 0.8)',
            borderColor: 'rgba(17, 153, 142, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Statistiques Mensuelles',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  setActiveTab(tab: 'dashboard' | 'clients' | 'agents' | 'comptes') {
    this.activeTab = tab;
    
    // Recréer les graphiques si on revient au dashboard
    if (tab === 'dashboard') {
      setTimeout(() => this.createCharts(), 100);
    }
  }

  createAgent() {
    if (this.newAgent.password !== this.newAgent.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.creatingAgent = true;
    this.adminService.createAgent({
      username: this.newAgent.username,
      email: this.newAgent.email,
      password: this.newAgent.password
    }).subscribe({
      next: (response: any) => {
        this.creatingAgent = false;
        this.showCreateAgentForm = false;
        this.newAgent = { username: '', email: '', password: '', confirmPassword: '' };
        this.loadAgents();
        alert('Agent créé avec succès');
      },
      error: (error: any) => {
        this.creatingAgent = false;
        alert('Erreur lors de la création de l\'agent: ' + (error.error?.message || error.message));
      }
    });
  }

  deleteAgent(agentId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      this.adminService.deleteAgent(agentId).subscribe({
        next: (response: any) => {
          this.loadAgents();
          alert('Agent supprimé avec succès');
        },
        error: (error: any) => {
          alert('Erreur lors de la suppression de l\'agent: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}