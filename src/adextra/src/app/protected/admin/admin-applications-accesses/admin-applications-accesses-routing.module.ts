import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ApplicationsAccessesComponent
} from '@app/protected/admin/admin-applications-accesses/applications-accesses/applications-accesses.component';


const routes: Routes = [
  {path: '', component: ApplicationsAccessesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminApplicationsAccessesRoutingModule { }
