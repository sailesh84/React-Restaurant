import { NgModule } from '@angular/core';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import {SharedModule} from '@app/shared';
import { AdminPanelFeatureComponent } from './admin-panel-feature/admin-panel-feature.component';

@NgModule({
  declarations: [
    AdminPanelComponent,
    AdminPanelFeatureComponent
  ],
  imports: [
    SharedModule,
    AdminPanelRoutingModule
  ]
})
export class AdminPanelModule { }
