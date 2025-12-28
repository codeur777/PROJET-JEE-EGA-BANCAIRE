import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Compte } from '../../shared/models/compte.model';

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

  createCompte(data: any): Observable<Compte> {
    return this.http.post<Compte>(this.api, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
