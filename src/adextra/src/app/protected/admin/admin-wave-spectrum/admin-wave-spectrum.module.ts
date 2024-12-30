import { NgModule } from '@angular/core';
import { AdminWebSpectrumRoutingModule } from './admin-wave-spectrum-routing.module';
import { WebSpectrumComponent } from './wave-spectrum/wave-spectrum.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [WebSpectrumComponent],
  imports: [
    SharedModule,
    AdminWebSpectrumRoutingModule
  ]
})
export class AdminWebSpectrumModule { }
