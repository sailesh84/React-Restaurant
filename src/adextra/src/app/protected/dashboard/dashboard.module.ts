import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';
import {DashboardRoutingModule} from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardFeatureProjectCardComponent } from './dashboard-feature-project-card/dashboard-feature-project-card.component';
import { DashboardMapCardComponent } from './dashboard-map-card/dashboard-map-card.component';
import { DashboardFeaturesComponent } from './dashboard-features/dashboard-features.component';
// import {
//   DashboardFeatureProjectProgressbarComponent
// } from './dashboard-feature-project-progressbar/dashboard-feature-project-progressbar.component';
// import {
//   DashboardFeatureProjectUpatedDateComponent
// } from './dashboard-feature-project-upated-date/dashboard-feature-project-upated-date.component';
// import { DashboardFeatureProjectProductComponent } from './dashboard-feature-project-product/dashboard-feature-project-product.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardFeatureProjectCardComponent,
    DashboardMapCardComponent,
    DashboardFeaturesComponent,
    // DashboardFeatureProjectProgressbarComponent,
    // DashboardFeatureProjectUpatedDateComponent,
    // DashboardFeatureProjectProductComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
