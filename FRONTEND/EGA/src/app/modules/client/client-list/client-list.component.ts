import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe((data: Client[]) => this.clients = data);
  }

  deleteClient(id: number) {
    if(confirm("Voulez-vous vraiment supprimer ce client ?")){
      this.clientService.deleteClient(id).subscribe(() => this.loadClients());
    }
  }
}
