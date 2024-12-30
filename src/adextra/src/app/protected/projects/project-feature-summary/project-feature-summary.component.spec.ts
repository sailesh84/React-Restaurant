import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HighchartsChartModule} from 'highcharts-angular';
import {FieldFeatureSummaryComponent} from '@app/protected/projects/field-feature-summary/field-feature-summary.component';

describe('ProjectFeatureSummaryComponent', () => {
  let component: FieldFeatureSummaryComponent;
  let fixture: ComponentFixture<FieldFeatureSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldFeatureSummaryComponent
      ],
      imports: [RouterTestingModule, HighchartsChartModule],
      // providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldFeatureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
