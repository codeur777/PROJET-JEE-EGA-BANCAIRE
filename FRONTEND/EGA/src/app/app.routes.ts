import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { 
  adminGuard, 
  agentGuard, 
  clientGuard, 
  notAdminGuard, 
  notClientGuard,
  noReleveForClientsGuard
} from './core/guards/role.guard';

// Auth
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

// Home
import { HomeComponent } from './modules/home/home.component';

// Client
import { ClientListComponent } from './modules/client/client-list/client-list.component';
import { ClientFormComponent } from './modules/client/client-form/client-form.component';
import { ClientDashboardComponent } from './modules/client/dashboard/client-dashboard.component';

// Admin
import { AdminComponent } from './modules/admin/admin.component';

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
  
  // Routes protégées - HOME (Agents uniquement)
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [agentGuard, notClientGuard]
  },
  
  // Routes protégées - CLIENT DASHBOARD (Clients uniquement)
  { 
    path: 'client/dashboard', 
    component: ClientDashboardComponent,
    canActivate: [clientGuard]
  },
  
  // Routes protégées - GESTION DES CLIENTS (Agents/Admins, pas clients)
  { 
    path: 'client', 
    component: ClientListComponent,
    canActivate: [notClientGuard]
  },
  { 
    path: 'client/add', 
    component: ClientFormComponent,
    canActivate: [notClientGuard]
  },
  { 
    path: 'client/edit/:id', 
    component: ClientFormComponent,
    canActivate: [notClientGuard]
  },
  
  // Routes protégées - ADMIN (Admins uniquement)
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  
  // Routes protégées - GESTION DES COMPTES (Agents/Clients, pas admins)
  { 
    path: 'compte', 
    component: CompteListComponent,
    canActivate: [notAdminGuard]
  },
  { 
    path: 'compte/add', 
    component: CompteFormComponent,
    canActivate: [notAdminGuard]
  },
  { 
    path: 'compte/edit/:id', 
    component: CompteFormComponent,
    canActivate: [notAdminGuard]
  },
  
  // Routes protégées - TRANSACTIONS (Agents/Clients, pas admins)
  { 
    path: 'transaction/depot', 
    component: DepotComponent,
    canActivate: [notAdminGuard]
  },
  { 
    path: 'transaction/retrait', 
    component: RetraitComponent,
    canActivate: [notAdminGuard]
  },
  { 
    path: 'transaction/virement', 
    component: VirementComponent,
    canActivate: [notAdminGuard]
  },
  { 
    path: 'transaction/historique', 
    component: HistoriqueComponent,
    canActivate: [notAdminGuard]
  },
  
  // Routes protégées - RELEVÉ (Agents uniquement, pas clients ni admins)
  { 
    path: 'releve', 
    component: ReleveComponent,
    canActivate: [noReleveForClientsGuard]
  },
  
  // Route 404
  { path: '**', redirectTo: '/login' }
];

