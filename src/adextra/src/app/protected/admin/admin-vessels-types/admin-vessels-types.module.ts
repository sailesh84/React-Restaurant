import { NgModule } from '@angular/core';

import { AdminVesselsTypesRoutingModule } from './admin-vessels-types-routing.module';
import {VesselsTypesComponent} from '@app/protected/admin/admin-vessels-types/vessels-types/vessels-types.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [
    VesselsTypesComponent
  ],
  imports: [
    SharedModule,
    AdminVesselsTypesRoutingModule
  ]
})
export class AdminVesselsTypesModule { }
