import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { DownloadCenterRoutingModule } from './download-center-routing.module';
import { DownloadCenterComponent } from './download-center/download-center.component';


@NgModule({
  declarations: [DownloadCenterComponent],
  imports: [
    SharedModule,
    DownloadCenterRoutingModule
  ]
})
export class DownloadCenterModule { }
