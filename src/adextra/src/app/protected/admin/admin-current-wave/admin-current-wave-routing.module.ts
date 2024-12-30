import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CurrentWaveComponent} from '@app/protected/admin/admin-current-wave/current-wave/current-wave.component';

const routes: Routes = [
  { path: '', component: CurrentWaveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCurrentWaveRoutingModule { }
