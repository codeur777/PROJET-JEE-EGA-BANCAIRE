import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of, throwError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../shared/models/transaction.model';
import { CompteService } from './compte.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private api = `${environment.apiUrl}/transactions`;

  constructor(
    private http: HttpClient,
    private compteService: CompteService
  ) {}

  depot(data: { compteId: number, montant: number }): Observable<any> {
    return this.http.post(`${this.api}/depot`, data, { 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => response.body),
      catchError(this.handleError)
    );
  }

  retrait(data: { compteId: number, montant: number }): Observable<any> {
    return this.http.post(`${this.api}/retrait`, data, { 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => response.body),
      catchError(this.handleError)
    );
  }

  virement(data: { source: number, destination: number, montant: number }): Observable<any> {
    return this.http.post(`${this.api}/virement`, data, { 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => response.body),
      catchError(this.handleError)
    );
  }

  /* getHistorique(compteId: number, debut: string, fin: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.api}/historique/${compteId}?debut=${debut}&fin=${fin}`
    );
  }  */


    getHistorique(compteId: number, debut: string, fin: string): Observable<Transaction[]> {
      const url = `${this.api}/historique/${compteId}?debut=${debut}&fin=${fin}`;
      console.log('URL appelée:', url); // Debug
      
      return this.http.get<Transaction[]>(url).pipe(
          tap(data => console.log('Données reçues:', data)), // Debug
          catchError((error) => {
              console.error('Erreur complète:', error);
              console.error('Status:', error.status);
              console.error('Message:', error.message);
              console.error('Error body:', error.error);
              return throwError(() => error);
          })
      );
  }
  // Nouvelle méthode pour récupérer les infos client par numéro de compte
  getClientInfoByNumeroCompte(numeroCompte: string): Observable<any> {
    // RETIRER LES ESPACES du numéro de compte
    const numeroSansEspaces = this.sanitizeNumeroCompte(numeroCompte);
    
    return this.compteService.getByNumeroWithClient(numeroSansEspaces).pipe(
      map((compte: any) => ({
        compteId: compte.id,
        compteNumero: compte.numeroCompte,
        compteNumeroFormate: this.formatNumeroCompte(compte.numeroCompte), // Formaté pour affichage
        clientId: compte.proprietaire?.id,
        clientName: compte.proprietaire
          ? `${compte.proprietaire.prenom} ${compte.proprietaire.nom}`
          : 'Client inconnu',
        solde: compte.solde,
        typeCompte: compte.typeCompte
      })),
      catchError((error) => {
        console.error('Erreur lors de la récupération du compte:', error);
        return of(null);
      })
    );
  }

  
  // Méthode pour nettoyer le numéro de compte (retirer les espaces)
  private sanitizeNumeroCompte(numeroCompte: string): string {
    return numeroCompte.replace(/\s/g, '');
  }

  // Méthode pour formater le numéro de compte pour l'affichage (ajouter des espaces)
  private formatNumeroCompte(numeroCompte: string): string {
    if (!numeroCompte) return '';
    const cleaned = numeroCompte.replace(/\s/g, '');
    // Format: FR61 3000 4000 0008 2266 1630 551
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  }

  // Gestionnaire d'erreurs amélioré
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 0) {
      // Erreur réseau
      errorMessage = 'Erreur de connexion au serveur';
    } else if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      errorMessage = error.error || `Code d'erreur: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Nouvelle méthode pour générer et télécharger le PDF du relevé
  downloadRelevePDF(compteId: number, dateDebut: string, dateFin: string): Observable<Blob> {
    const url = `${environment.apiUrl}/releves/pdf/${compteId}?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
      timeout: 30000 // Timeout de 30 secondes
    }).pipe(
      map(response => {
        if (response.body) {
          return response.body;
        } else {
          throw new Error('Aucun contenu PDF reçu');
        }
      }),
      catchError((error) => {
        console.error('Erreur lors du téléchargement du PDF:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('La génération du PDF prend trop de temps. Veuillez réessayer avec une période plus courte.'));
        }
        return throwError(() => new Error('Erreur lors de la génération du PDF'));
      })
    );
  }
}