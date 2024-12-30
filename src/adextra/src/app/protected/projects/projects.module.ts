import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { ProjectsComponent } from './projects/projects.component';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectFeatureComponent } from './project-feature/project-feature.component';
import { ProjectFeatureViewComponent } from './project-feature-view/project-feature-view.component';
import { ProjectFeatureSummaryComponent } from './project-feature-summary/project-feature-summary.component';
import { ProjectFeatureAnalysisComponent } from './project-feature-analysis/project-feature-analysis.component';
import { ProjectFeatureForecastsComponent } from './project-feature-forecasts/project-feature-forecasts.component';
import { ProjectFeatureContactCardComponent } from './project-feature-contact-card/project-feature-contact-card.component';
import { ProjectFeatureCompareComponent } from './project-feature-compare/project-feature-compare.component';
import { ProjectFeatureInfoComponent } from './project-feature-info/project-feature-info.component';
import { ProjectFeatureResultComponent } from './project-feature-result/project-feature-result.component';
import { ProjectWeatherInterpreterComponent } from './project-weather-interpreter/project-weather-interpreter.component';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectFeatureComponent,
    ProjectFeatureViewComponent,
    ProjectFeatureSummaryComponent,
    ProjectFeatureAnalysisComponent,
    ProjectFeatureForecastsComponent,
    ProjectFeatureContactCardComponent,
    ProjectFeatureCompareComponent,
    ProjectFeatureInfoComponent,
    ProjectFeatureResultComponent,
    ProjectWeatherInterpreterComponent
  ],
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
