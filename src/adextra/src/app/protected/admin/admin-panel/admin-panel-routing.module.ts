import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminPanelComponent} from '@app/protected/admin/admin-panel/admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', component: AdminPanelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
