import { NgModule } from '@angular/core';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SharedModule } from '@app/shared';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulerFeaturesComponent } from './scheduler-features/scheduler-features.component';
import { SchedulerFeatureViewComponent } from './scheduler-feature-view/scheduler-feature-view.component';
import { SchedulerFeatureGanttComponent } from './scheduler-feature-gantt/scheduler-feature-gantt.component';
import { SchedulerFeatureTableComponent } from './scheduler-feature-table/scheduler-feature-table.component';
import { SchedulerFeatureModularAnalysisComponent } from './scheduler-feature-modular-analysis/scheduler-feature-modular-analysis.component';


@NgModule({
  declarations: [
    SchedulerComponent,
    SchedulerFeaturesComponent,
    SchedulerFeatureViewComponent,
    SchedulerFeatureGanttComponent,
    SchedulerFeatureTableComponent,
    SchedulerFeatureModularAnalysisComponent
  ],
  imports: [
    SharedModule,
    SchedulerRoutingModule
  ]
})
export class SchedulerModule { }
