import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientsComponent} from '@app/protected/admin/admin-clients/clients/clients.component';


const routes: Routes = [
  {path: '', component: ClientsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminClientsRoutingModule { }
