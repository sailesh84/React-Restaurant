import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';
import { ApplicationsAccessesComponent } from './applications-accesses/applications-accesses.component';
import {
  AdminApplicationsAccessesRoutingModule
} from '@app/protected/admin/admin-applications-accesses/admin-applications-accesses-routing.module';



@NgModule({
  declarations: [ApplicationsAccessesComponent],
  imports: [
    SharedModule,
    AdminApplicationsAccessesRoutingModule
  ]
})
export class AdminApplicationsAccessesModule { }
