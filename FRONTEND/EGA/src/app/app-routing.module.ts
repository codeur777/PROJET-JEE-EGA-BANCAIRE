import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ClientListComponent } from './modules/client/client-list/client-list.component';
import { ClientFormComponent } from './modules/client/client-form/client-form.component';
import { CompteListComponent } from './modules/compte/compte-list/compte-list.component';
import { CompteFormComponent } from './modules/compte/compte-form/compte-form.component';
import { DepotComponent } from './modules/transaction/depot/depot.component';
import { RetraitComponent } from './modules/transaction/retrait/retrait.component';
import { VirementComponent } from './modules/transaction/virement/virement.component';
import { HistoriqueComponent } from './modules/transaction/historique/historique.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full' },
  { path:'login', component:LoginComponent },
  { path:'register', component:RegisterComponent },
  { path:'client', component:ClientListComponent },
  { path:'client/add', component:ClientFormComponent },
  { path:'client/edit/:id', component:ClientFormComponent },
  { path:'compte', component:CompteListComponent },
  { path:'home', component: HomeComponent },
  { path:'compte/add', component:CompteFormComponent },
  { path:'transaction/depot', component:DepotComponent },
  { path:'transaction/retrait', component:RetraitComponent },
  { path:'transaction/virement', component:VirementComponent },
  { path:'transaction/historique', component:HistoriqueComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


