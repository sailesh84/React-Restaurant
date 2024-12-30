import { NgModule } from '@angular/core';

import { AdminForecastersRoutingModule } from './admin-forecasters-routing.module';
import { ForecastersComponent } from './forecasters/forecasters.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [ForecastersComponent],
  imports: [
    SharedModule,
    AdminForecastersRoutingModule
  ]
})
export class AdminForecastersModule { }
