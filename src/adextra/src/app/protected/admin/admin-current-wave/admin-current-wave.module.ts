import { NgModule } from '@angular/core';

import { AdminCurrentWaveRoutingModule } from './admin-current-wave-routing.module';
import { CurrentWaveComponent } from './current-wave/current-wave.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [CurrentWaveComponent],
  imports: [
    SharedModule,
    AdminCurrentWaveRoutingModule
  ]
})
export class AdminCurrentWaveModule { }
