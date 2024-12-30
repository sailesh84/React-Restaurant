import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RequestsComponent} from '@app/protected/admin/admin-requests/requests/requests.component';

const routes: Routes = [
  { path: '', component: RequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRequestsRoutingModule { }
