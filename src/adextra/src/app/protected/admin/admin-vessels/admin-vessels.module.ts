import { NgModule } from '@angular/core';

import { AdminVesselsRoutingModule } from './admin-vessels-routing.module';
import { VesselsComponent } from './vessels/vessels.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [VesselsComponent],
  imports: [
    SharedModule,
    AdminVesselsRoutingModule
  ]
})
export class AdminVesselsModule { }
