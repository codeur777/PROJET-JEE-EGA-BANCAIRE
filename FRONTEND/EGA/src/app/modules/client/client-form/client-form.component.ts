import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  client: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    statut: 'ACTIF',
    dateNaissance: undefined,
    sexe: '',
    nationalite: 'Togolaise',
    ville: '',
    codePostal: '',
    typeDocument: '',
    numeroDocument: ''
  };
  
  id?: number;
  loading: boolean = false;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.loadClient();
    }
  }

  loadClient() {
    if (this.id) {
      this.clientService.getClientById(this.id).subscribe({
        next: (res: Client) => {
          this.client = res;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du client:', err);
          alert('Erreur lors du chargement des données du client');
        }
      });
    }
  }

  save() {
    this.loading = true;
    const request = this.id
      ? this.clientService.updateClient(this.id, this.client)
      : this.clientService.createClient(this.client);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = this.id 
          ? 'Client modifié avec succès !' 
          : 'Client créé avec succès !';
        
        setTimeout(() => {
          this.router.navigate(['/client']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur:', err);
        alert('Une erreur est survenue lors de l\'enregistrement');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Gérer l'upload de fichier (à implémenter avec backend)
      console.log('Fichier sélectionné:', file.name);
      alert(`Fichier "${file.name}" sélectionné. Upload en cours de développement.`);
    }
  }
}