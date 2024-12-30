import { NgModule } from '@angular/core';

import { ProtectedRoutingModule } from './protected-routing.module';
import {SharedModule} from '../shared';
import { ProtectedComponent } from './protected.component';

@NgModule({
  declarations: [ProtectedComponent],
  imports: [
    SharedModule,
    ProtectedRoutingModule,
  ]
})
export class ProtectedModule { }
