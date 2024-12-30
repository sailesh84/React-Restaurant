import { NgModule } from '@angular/core';

import { AdminProjectsRoutingModule } from './admin-projects-routing.module';
import {SharedModule} from '@app/shared';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    SharedModule,
    AdminProjectsRoutingModule
  ]
})
export class AdminProjectsModule { }
