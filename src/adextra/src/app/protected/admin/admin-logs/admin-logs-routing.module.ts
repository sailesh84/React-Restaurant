import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LogsComponent} from '@app/protected/admin/admin-logs/logs/logs.component';

const routes: Routes = [
  { path: '', component: LogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLogsRoutingModule { }
