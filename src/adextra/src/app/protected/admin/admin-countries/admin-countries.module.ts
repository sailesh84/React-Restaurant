import { NgModule } from '@angular/core';

import { AdminCountriesRoutingModule } from './admin-countries-routing.module';
import { CountriesComponent } from './countries/countries.component';
import {SharedModule} from '@app/shared';


@NgModule({
  declarations: [CountriesComponent],
  imports: [
    SharedModule,
    AdminCountriesRoutingModule
  ]
})
export class AdminCountriesModule { }
