import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CountriesComponent} from '@app/protected/admin/admin-countries/countries/countries.component';


const routes: Routes = [
  { path: '', component: CountriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCountriesRoutingModule { }
