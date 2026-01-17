import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Auth
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

// Home
import { HomeComponent } from './modules/home/home.component';

// Client
import { ClientListComponent } from './modules/client/client-list/client-list.component';
import { ClientFormComponent } from './modules/client/client-form/client-form.component';

// Compte
import { CompteListComponent } from './modules/compte/compte-list/compte-list.component';
import { CompteFormComponent } from './modules/compte/compte-form/compte-form.component';

// Transactions
import { DepotComponent } from './modules/transaction/depot/depot.component';
import { RetraitComponent } from './modules/transaction/retrait/retrait.component';
import { VirementComponent } from './modules/transaction/virement/virement.component';
import { HistoriqueComponent } from './modules/transaction/historique/historique.component';

// Relevé
import { ReleveComponent } from './modules/releve/releve.component';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Routes protégées
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },

  /*{ 
    path: 'dashboard', 
    component: HomeComponent,
    canActivate: [authGuard]
  },*/
  
  // Gestion des clients
  { 
    path: 'client', 
    component: ClientListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'client/add', 
    component: ClientFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'client/edit/:id', 
    component: ClientFormComponent,
    canActivate: [authGuard]
  },
  
  // Gestion des comptes
  { 
    path: 'compte', 
    component: CompteListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'compte/add', 
    component: CompteFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'compte/edit/:id', 
    component: CompteFormComponent,
    canActivate: [authGuard]
  },
  
  // Transactions
  { 
    path: 'transaction/depot', 
    component: DepotComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transaction/retrait', 
    component: RetraitComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transaction/virement', 
    component: VirementComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transaction/historique', 
    component: HistoriqueComponent,
    canActivate: [authGuard]
  },
  
  // Relevé bancaire
  { 
    path: 'releve', 
    component: ReleveComponent,
    canActivate: [authGuard]
  },
  
  // Route 404
  { path: '**', redirectTo: '/login' }
];

