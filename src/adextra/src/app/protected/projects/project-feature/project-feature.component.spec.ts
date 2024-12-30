import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HighchartsChartModule} from 'highcharts-angular';
import {FieldFeatureViewComponent} from '@app/protected/projects/field-feature-view/field-feature-view.component';
import {FIELDS} from '@app/shared/mocks/mock-projects';
import {FieldFeatureSummaryComponent} from '@app/protected/projects/field-feature-summary/field-feature-summary.component';
import {FieldFeatureForecastsComponent} from '@app/protected/projects/field-feature-forecasts/field-feature-charts.component';
import {FieldFeatureAnalysisComponent} from '@app/protected/projects/field-feature-analysis/field-feature-compute.component';
import {Project} from '@app/shared/models/project';
import {FieldFeatureComponent} from '@app/protected/projects/field-feature/field-feature.component';
import {ProjectsService} from '@app/core/services/projects.service';

describe('ProjectFeatureComponent', () => {
  let component: FieldFeatureComponent;
  let fixture: ComponentFixture<FieldFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFeatureComponent, FieldFeatureViewComponent, FieldFeatureSummaryComponent, FieldFeatureForecastsComponent,
        FieldFeatureAnalysisComponent
      ],
      imports: [RouterTestingModule, HighchartsChartModule],
      providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFeatureComponent);
    component = fixture.componentInstance;
    component.fieldID = 1;
    component.field = FIELDS[0];
    component.title = 'Project ';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
