import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DownloadCenterComponent} from '@app/protected/download-center/download-center/download-center.component';


const routes: Routes = [
  {
    path: '',
    component: DownloadCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadCenterRoutingModule { }
