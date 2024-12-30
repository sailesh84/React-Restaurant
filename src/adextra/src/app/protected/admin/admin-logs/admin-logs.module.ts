import { NgModule } from '@angular/core';

import { AdminLogsRoutingModule } from './admin-logs-routing.module';
import { LogsComponent } from './logs/logs.component';
import {SharedModule} from '@app/shared';
import {MapLocationLogsComponent} from './map-location-logs/map-location-logs.component';

@NgModule({
  declarations: [LogsComponent, MapLocationLogsComponent],
  imports: [
    SharedModule,
    AdminLogsRoutingModule
  ]
})
export class AdminLogsModule { }
