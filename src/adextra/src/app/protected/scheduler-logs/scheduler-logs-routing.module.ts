import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerLogsComponent } from './scheduler-logs/scheduler-logs.component';

const routes: Routes = [
    { path: '', component: SchedulerLogsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SchedulerLogsRoutingModule { }
