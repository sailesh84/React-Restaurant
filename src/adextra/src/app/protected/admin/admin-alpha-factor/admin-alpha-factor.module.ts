import { NgModule } from '@angular/core';
import { AdminAlphaFactorRoutingModule } from './admin-alpha-factor.routing.module';
import { AlphaFactorComponent } from "@app/protected/admin/admin-alpha-factor/alpha-factor/alpha-factor.component";
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    AlphaFactorComponent
  ],
  imports: [
    SharedModule,
    AdminAlphaFactorRoutingModule
  ]
})
export class AdminAlphaFactorModule { }
