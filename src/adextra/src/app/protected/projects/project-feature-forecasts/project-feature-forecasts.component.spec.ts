import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {FieldFeatureForecastsComponent} from '@app/protected/projects/field-feature-forecasts/field-feature-charts.component';
import {FIELDS} from '@app/shared/mocks/mock-projects';
import {HighchartsChartModule} from 'highcharts-angular';

describe('FieldFeatureChartsComponent', () => {
  let component: FieldFeatureForecastsComponent;
  let fixture: ComponentFixture<FieldFeatureForecastsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFeatureForecastsComponent
      ],
      imports: [RouterTestingModule, HighchartsChartModule],
      // providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFeatureForecastsComponent);
    component = fixture.componentInstance;
    component.field = FIELDS[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
