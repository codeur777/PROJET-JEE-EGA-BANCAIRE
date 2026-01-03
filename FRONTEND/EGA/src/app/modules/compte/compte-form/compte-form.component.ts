import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompteService } from '../../../core/services/compte.service';
import { ClientService } from '../../../core/services/client.service';
import { Compte } from '../../../shared/models/compte.model';
import { Client } from '../../../shared/models/client.model';

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.css']
})
export class CompteFormComponent implements OnInit {
  compte: Compte = {
    numeroCompte: '',
    solde: 0,
    typeCompte: 'COURANT',
    statut: 'OUVERT',
    clientId: null
  };
  
  clients: Client[] = [];
  id?: number;
  loading: boolean = false;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compteService: CompteService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadClients();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.loadCompte();
    } else {
      // Générer un numéro IBAN automatiquement pour un nouveau compte
      this.generateIBAN();
    }
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        console.log('✅ Clients chargés:', this.clients.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des clients:', err);
        alert('Erreur lors du chargement de la liste des clients');
      }
    });
  }

  loadCompte() {
    if (this.id) {
      this.compteService.getById(this.id).subscribe({
        next: (res: Compte) => {
          this.compte = res;
          console.log('✅ Compte chargé:', this.compte);
        },
        error: (err) => {
          console.error('❌ Erreur lors du chargement du compte:', err);
          alert('Erreur lors du chargement des données du compte');
        }
      });
    }
  }

  generateIBAN() {
    // Générer un IBAN fictif pour la démo (format français)
    const bankCode = '30004';
    const branchCode = '00000';
    const accountNumber = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
    const key = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    // Calcul simplifié de la clé RIB (pas le vrai algorithme)
    const checkDigits = (97 - (parseInt(bankCode + branchCode + accountNumber + key) % 97)).toString().padStart(2, '0');
    
    this.compte.numeroCompte = `FR${checkDigits}${bankCode}${branchCode}${accountNumber}${key}`;
    
    console.log('🔢 IBAN généré:', this.compte.numeroCompte);
  }

  formatNumeroCompte(numero: string): string {
    if (!numero) return '';
    
    // Formater par groupes de 4 caractères
    return numero.match(/.{1,4}/g)?.join(' ') || numero;
  }

  getClientName(clientId: number | null | undefined): string {
  if (!clientId) return 'Non défini';
  
  const client = this.clients.find(c => c.id === clientId);
  return client ? `${client.nom} ${client.prenom}` : 'Client inconnu';
}

save() {
  this.loading = true;

  // ✅ OBJET COMPATIBLE BACKEND (DTO)
  const payload = {
    numeroCompte: this.compte.numeroCompte,
    typeCompte: this.compte.typeCompte,   // ⚠️ typeCompte, PAS type
    solde: this.compte.solde,
    clientId: this.compte.clientId
  };

  console.log('📤 Payload envoyé:', payload);

  const request = this.id
    ? this.compteService.updateCompte(this.id, payload)
    : this.compteService.createCompte(payload);

  request.subscribe({
    next: () => {
      this.loading = false;
      this.successMessage = this.id
        ? 'Compte modifié avec succès !'
        : 'Compte créé avec succès !';

      setTimeout(() => {
        this.router.navigate(['/compte']);
      }, 1500);
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ Erreur:', err);
      alert('Erreur lors de l’enregistrement du compte');
    }
  });
  }

}