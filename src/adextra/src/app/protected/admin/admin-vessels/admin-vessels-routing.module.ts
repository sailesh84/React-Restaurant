import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VesselsComponent} from '@app/protected/admin/admin-vessels/vessels/vessels.component';

const routes: Routes = [
  { path: '', component: VesselsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminVesselsRoutingModule { }
