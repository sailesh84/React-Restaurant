import { NgModule } from '@angular/core';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './requests/requests.component';
import { RequestsFeatureComponent } from './requests-feature/requests-feature.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [RequestsComponent, RequestsFeatureComponent],
  imports: [
    SharedModule,
    RequestsRoutingModule
  ]
})
export class RequestsModule { }
