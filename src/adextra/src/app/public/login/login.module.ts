import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import {SharedModule} from '@app/shared';
import {LoginRoutingModule} from './login-routing.module';
import { LoginFeatureComponent } from './login-feature/login-feature.component';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [LoginComponent, LoginFeatureComponent],
  imports: [
    SharedModule,
    LoginRoutingModule,
    NgxCaptchaModule
  ]
})
export class LoginModule { }
