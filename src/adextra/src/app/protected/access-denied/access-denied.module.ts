import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import {AccessDeniedRoutingModule} from './access-denied-routing.module';

@NgModule({
  declarations: [AccessDeniedComponent],
  imports: [
    SharedModule,
    AccessDeniedRoutingModule
  ]
})
export class AccessDeniedModule { }
