import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HighchartsChartModule} from 'highcharts-angular';
import {FieldFeatureViewComponent} from '@app/protected/projects/field-feature-view/field-feature-view.component';
import {FieldFeatureSummaryComponent} from '@app/protected/projects/field-feature-summary/field-feature-summary.component';
import {FieldFeatureForecastsComponent} from '@app/protected/projects/field-feature-forecasts/field-feature-forecasts.component';
import {FieldFeatureAnalysisComponent} from '@app/protected/projects/field-feature-analysis/field-feature-analysis.component';

describe('ProjectFeatureViewComponent', () => {
  let component: FieldFeatureViewComponent;
  let fixture: ComponentFixture<FieldFeatureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFeatureViewComponent, FieldFeatureSummaryComponent, FieldFeatureForecastsComponent, FieldFeatureAnalysisComponent
      ],
      imports: [RouterTestingModule, HighchartsChartModule],
      // providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFeatureViewComponent);
    component = fixture.componentInstance;
    component.field = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
