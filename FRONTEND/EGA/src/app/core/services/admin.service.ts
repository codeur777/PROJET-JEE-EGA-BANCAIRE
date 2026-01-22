import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les agents
  getAllAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/agents`);
  }

  // Créer un nouvel agent
  createAgent(agentData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/agents`, agentData);
  }

  // Supprimer un agent
  deleteAgent(agentId: number): Observable<any> {
    return this.http.delete(`${this.api}/agents/${agentId}`);
  }

  // Récupérer les statistiques générales
  getStats(): Observable<any> {
    return this.http.get(`${this.api}/stats`);
  }
}