import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchedulerComponent} from '@app/protected/scheduler/scheduler/scheduler.component';

const routes: Routes = [
  { path: '', component: SchedulerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }
