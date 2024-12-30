import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VesselsTypesComponent} from '@app/protected/admin/admin-vessels-types/vessels-types/vessels-types.component';

const routes: Routes = [
  { path: '', component: VesselsTypesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminVesselsTypesRoutingModule { }
