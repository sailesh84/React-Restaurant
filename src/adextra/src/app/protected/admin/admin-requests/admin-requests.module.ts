import { NgModule } from '@angular/core';

import { AdminRequestsRoutingModule } from './admin-requests-routing.module';
import { RequestsComponent } from './requests/requests.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [RequestsComponent],
  imports: [
    SharedModule,
    AdminRequestsRoutingModule
  ]
})
export class AdminRequestsModule { }
