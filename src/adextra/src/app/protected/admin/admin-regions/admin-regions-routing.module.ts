import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegionsComponent} from '@app/protected/admin/admin-regions/regions/regions.component';


const routes: Routes = [
  {path: '', component: RegionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRegionsRoutingModule { }
