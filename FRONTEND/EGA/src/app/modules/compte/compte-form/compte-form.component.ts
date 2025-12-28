import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompteService } from '../../../core/services/compte.service';

@Component({
  selector: 'app-compte-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.css']
})
export class CompteFormComponent {
  compte = { numeroCompte:'',solde:0,type:'COURANT',statut:'OUVERT',clientId:null };

  constructor(private service: CompteService, private router: Router) {}

  save() {
    this.service.createCompte(this.compte).subscribe(() => this.router.navigate(['/compte']));
  }
}
