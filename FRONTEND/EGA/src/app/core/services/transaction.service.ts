import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private api = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  depot(data: any): Observable<any> {
    return this.http.post(`${this.api}/depot`, data);
  }

  retrait(data: any): Observable<any> {
    return this.http.post(`${this.api}/retrait`, data);
  }

  virement(data: any): Observable<any> {
    return this.http.post(`${this.api}/virement`, data);
  }

  getHistorique(compteId: number, debut: string, fin: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/historique/${compteId}?debut=${debut}&fin=${fin}`);
  }
}
