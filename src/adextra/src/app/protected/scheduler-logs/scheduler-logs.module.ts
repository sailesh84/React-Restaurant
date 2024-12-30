import { NgModule } from '@angular/core';
import { SchedulerLogsRoutingModule } from './scheduler-logs-routing.module';
import { SharedModule } from '@app/shared';
import { SchedulerLogsComponent } from './scheduler-logs/scheduler-logs.component';
import { SchedulerLogsInfoComponent } from './scheduler-logs-info/scheduler-logs-info.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [
        SchedulerLogsComponent,
        SchedulerLogsInfoComponent
    ],
    imports: [
        SharedModule,
        BsDatepickerModule.forRoot(),
        SchedulerLogsRoutingModule
    ]
})

export class SchedulerLogsModule { }