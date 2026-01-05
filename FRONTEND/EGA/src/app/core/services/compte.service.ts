import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Compte } from '../../shared/models/compte.model';
import { CompteCreateDTO } from '../../shared/models/compte-create.Dto';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  private api = `${environment.apiUrl}/comptes`;

  constructor(private http: HttpClient) {}

  getComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.api);
  }

  getById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.api}/${id}`);
  }

  // Nouvelle méthode pour récupérer un compte par son numéro
  getByNumero(numeroCompte: string): Observable<Compte> {
    const numeroSansEspaces = numeroCompte.replace(/\s/g, '');
    return this.http.get<Compte>(`${this.api}/by-numero/${numeroSansEspaces}`).pipe(
      catchError((error) => {
        console.error('Erreur getByNumero:', error);
        throw error;
      })
    );
  }

  // Nouvelle méthode pour récupérer un compte par numéro avec client inclus
  getByNumeroWithClient(numeroCompte: string): Observable<Compte> {
    const numeroSansEspaces = numeroCompte.replace(/\s/g, '');
    return this.http.get<Compte>(`${this.api}/by-numero-with-client/${numeroSansEspaces}`).pipe(
      catchError((error) => {
        console.error('Erreur getByNumeroWithClient:', error);
        throw error;
      })
    );
  }

  createCompte(dto: CompteCreateDTO) {
    return this.http.post(`${this.api}`, dto);
  }

  updateCompte(id: number, dto: CompteCreateDTO) {
    return this.http.put(`${this.api}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}