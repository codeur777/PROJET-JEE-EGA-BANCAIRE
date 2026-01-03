import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // ← Ajouté pour l'upload
import { environment } from '../../../../environments/environment'; // ← À vérifier selon ton chemin

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
    dateNaissance: '',
    sexe: '',
    nationalite: 'Togolaise',
    ville: '',
    codePostal: '',
    typeDocument: '',
    numeroDocument: ''
  };

  id?: number;
  loading = false;
  successMessage = '';
  selectedFile?: File;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private http: HttpClient // ← Nécessaire pour l'upload de fichier
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.loadClient();
    }
  }

  loadClient(): void {
    if (this.id) {
      this.clientService.getClientById(this.id).subscribe({
        next: (client: Client) => {
          this.client = client;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du client:', err);
          alert('Erreur lors du chargement des données du client');
        }
      });
    }
  }

  save(): void {
  this.loading = true;
  this.successMessage = '';

  const request = this.id
    ? this.clientService.updateClient(this.id, this.client)
    : this.clientService.createClient(this.client);

  request.subscribe({
    next: (createdClient: any) => {

      // 🔥 Upload automatique après création
      if (!this.id && this.selectedFile) {
        this.id = createdClient.id;

        this.uploadFile(this.selectedFile);
      }

      this.loading = false;
      this.successMessage = this.id
        ? 'Client modifié avec succès !'
        : 'Client créé avec succès (document uploadé)';

      setTimeout(() => {
        this.router.navigate(['/client']);
      }, 1500);
    },
    error: (err) => {
      this.loading = false;
      console.error('Erreur lors de l\'enregistrement:', err);
      alert('Une erreur est survenue lors de l\'enregistrement');
    }
  });
}

  // Méthode pour gérer la sélection de fichier
  onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;
  console.log('📄 Fichier sélectionné:', file.name);

  // Si le client existe déjà → upload direct
  if (this.id) {
    this.uploadFile(file);
  }
}


  // Méthode privée pour uploader le fichier
  private uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

      this.http.post(
        `${environment.apiUrl}/clients/${this.id}/upload`,
        formData,
        { responseType: 'text' }   // 🔥 IMPORTANT
      ).subscribe({
        next: (res) => {
          console.log('✅ Upload réussi:', res);
        },
        error: (err) => {
          console.error('❌ Erreur upload:', err);
        }
      });

  }
}