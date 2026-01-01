import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../shared/components/layout/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    HeaderComponent,
    HttpClientModule // <-- IMPORTANT !
  ]
})
export class HomeComponent implements OnInit {

  message: string = "Vérification connexion...";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8082/api/test/ping', { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log("Connexion Backend OK ✔️ -->", res);
        },
        error: (err) => {
          console.error("Erreur ❌ -->", err);
          this.message = "Backend non connecté ❌";
        }
      });
  }
}
