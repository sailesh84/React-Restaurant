import { NgModule } from '@angular/core';

import { AdminExplanationsRoutingModule } from './admin-explanations-routing.module';
import {SharedModule} from '@app/shared';
import {ExplanationsComponent} from '@app/protected/admin/admin-explanations/explanations/explanations.component';

@NgModule({
  declarations: [
    ExplanationsComponent
  ],
  imports: [
    SharedModule,
    AdminExplanationsRoutingModule
  ]
})
export class AdminExplanationsModule { }
