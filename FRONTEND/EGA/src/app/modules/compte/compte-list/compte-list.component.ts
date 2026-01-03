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
  loading = false;
  error = '';

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  trackById(_: number, c: Compte) {
    return c.id;
  }

  loadComptes(): void {
    this.loading = true;
    this.error = '';

    this.compteService.getComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les comptes';
        this.loading = false;
      }
    });
  }

  totalSolde(): number {
    return this.comptes.reduce((s, c) => s + (c.solde || 0), 0);
  }

  getComptesByType(type: 'COURANT' | 'EPARGNE'): number {
    return this.comptes.filter(c => c.typeCompte === type).length;
  }

  formatNumero(n: string): string {
    return n?.match(/.{1,4}/g)?.join(' ') ?? '—';
  }

  statutClass(statut?: string): string {
    return statut ? statut.toLowerCase() : 'ouvert';
  }

  deleteCompte(id?: number) {
    if (!id || !confirm('Supprimer ce compte ?')) return;

    this.compteService.delete(id).subscribe(() => this.loadComptes());
  }
}
