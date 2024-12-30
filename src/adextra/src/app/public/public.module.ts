import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import {SharedModule} from '../shared';
import { LoginModule } from './login/login.module';
import { NotFoundModule } from './not-found/not-found.module';
import {RegisterModule} from './register/register.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    PublicRoutingModule,
    LoginModule,
    NotFoundModule,
    RegisterModule,
  ]
})
export class PublicModule { }
