import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private api = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  depot(data: any) {
    return this.http.post(`${this.api}/depot`, data);
  }

  retrait(data: any) {
    return this.http.post(`${this.api}/retrait`, data);
  }

  virement(data: any) {
    return this.http.post(`${this.api}/virement`, data);
  }

  historique(compteId: number, debut: string, fin: string) {
    return this.http.get(`${this.api}/historique/${compteId}?debut=${debut}&fin=${fin}`);
  }
}
