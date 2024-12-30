import { NgModule } from '@angular/core';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register/register.component';
import {SharedModule} from '@app/shared';
import { RegisterFeatureComponent } from './register-feature/register-feature.component';

@NgModule({
  declarations: [RegisterComponent, RegisterFeatureComponent],
  imports: [
    SharedModule,
    RegisterRoutingModule,
  ]
})
export class RegisterModule { }
