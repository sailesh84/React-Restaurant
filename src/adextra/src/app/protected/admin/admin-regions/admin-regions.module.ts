import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { AdminRegionsRoutingModule } from './admin-regions-routing.module';
import { RegionsComponent } from './regions/regions.component';


@NgModule({
  declarations: [RegionsComponent],
  imports: [
    SharedModule,
    AdminRegionsRoutingModule
  ]
})
export class AdminRegionsModule { }
