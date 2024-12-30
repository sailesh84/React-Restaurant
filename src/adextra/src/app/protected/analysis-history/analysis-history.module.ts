import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { AnalysisHistoryRoutingModule } from './analysis-history-routing.module';
import { HistoryComponent } from './history/history.component';
import { HistoryFeaturesComponent } from './history-features/history-features.component';
import { HistoryFeatureSummaryComponent } from './history-feature-summary/history-feature-summary.component';
import { HistoryFeatureAnalysisComponent } from './history-feature-analysis/history-feature-analysis.component';
import { HistoryFeatureViewComponent } from './history-feature-view/history-feature-view.component';
import { HistoryFeatureForecastsComponent } from './history-feature-forecasts/history-feature-forecasts.component';
import {HistoryFeatureInfoComponent} from '@app/protected/analysis-history/history-feature-info/history-feature-info.component';


@NgModule({
  declarations: [
    HistoryComponent,
    HistoryFeaturesComponent,
    HistoryFeatureSummaryComponent,
    HistoryFeatureAnalysisComponent,
    HistoryFeatureViewComponent,
    HistoryFeatureForecastsComponent,
    HistoryFeatureInfoComponent
  ],
  imports: [
    SharedModule,
    AnalysisHistoryRoutingModule
  ]
})
export class AnalysisHistoryModule { }
