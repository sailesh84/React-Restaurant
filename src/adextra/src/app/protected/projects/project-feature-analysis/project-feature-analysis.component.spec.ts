import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HighchartsChartModule} from 'highcharts-angular';
import {FieldFeatureAnalysisComponent} from '@app/protected/projects/field-feature-analysis/field-feature-compute.component';

describe('FieldFeatureComputeComponent', () => {
  let component: FieldFeatureAnalysisComponent;
  let fixture: ComponentFixture<FieldFeatureAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFeatureAnalysisComponent
      ],
      imports: [RouterTestingModule, HighchartsChartModule],
      // providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFeatureAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
