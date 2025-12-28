import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  client: Client = { nom:'',prenom:'',email:'',telephone:'',adresse:'' };
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.clientService.getClientById(this.id).subscribe((res: Client) => this.client = res);
    }
  }

  save() {
    const request = this.id
      ? this.clientService.updateClient(this.id!, this.client)
      : this.clientService.createClient(this.client);

    request.subscribe(() => this.router.navigate(['/client']));
  }
}
