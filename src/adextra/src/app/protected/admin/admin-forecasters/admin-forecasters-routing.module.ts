import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForecastersComponent} from '@app/protected/admin/admin-forecasters/forecasters/forecasters.component';

const routes: Routes = [
  { path: '', component: ForecastersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminForecastersRoutingModule { }
