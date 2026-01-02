import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompteService } from '../../../core/services/compte.service';
import { Compte } from '../../../shared/models/compte.model';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './compte-list.component.html',
  styleUrls: ['./compte-list.component.css']
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    this.loadComptes();
  }

  // ✅ AJOUT DE CETTE MÉTHODE POUR FIXER L'ERREUR
  trackById(index: number, item: Compte): number | undefined {
    return item.id;
  }

  loadComptes() {
    this.compteService.getComptes().subscribe({
      next: (data: Compte[]) => {
        this.comptes = data;
        console.log('✅ Comptes chargés:', this.comptes.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des comptes:', err);
        alert('Erreur lors du chargement des comptes');
      }
    });
  }

  getTotalSolde(): number {
    return this.comptes.reduce((sum, compte) => sum + (compte.solde || 0), 0);
  }

  getComptesByType(type: string): number {
    return this.comptes.filter(c => c.type === type).length;
  }

  formatNumeroCompte(numero: string): string {
    if (!numero) return 'N/A';
    return numero.match(/.{1,4}/g)?.join(' ') || numero;
  }

  deleteCompte(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.delete(id).subscribe({
        next: () => {
          alert('Compte supprimé avec succès');
          this.loadComptes();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du compte');
        }
      });
    }
  }
}