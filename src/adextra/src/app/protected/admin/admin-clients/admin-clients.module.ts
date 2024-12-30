import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { AdminClientsRoutingModule } from './admin-clients-routing.module';
import { ClientsComponent } from './clients/clients.component';


@NgModule({
  declarations: [ClientsComponent],
  imports: [
    SharedModule,
    AdminClientsRoutingModule
  ]
})
export class AdminClientsModule { }
