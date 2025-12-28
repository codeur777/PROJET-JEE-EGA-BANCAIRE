import { Component, OnInit } from '@angular/core';
import { CompteService } from '../../../core/services/compte.service';
import { Compte } from '../../../shared/models/compte.model';

@Component({
  selector: 'app-compte-list',
  templateUrl: './compte-list.component.html',
  styleUrls: ['./compte-list.component.css']
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    this.compteService.getComptes().subscribe(data => this.comptes = data);
  }
}
