import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeatureProjectProgressbarComponent } from './dashboard-feature-project-progressbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

describe('DashboardFeatureProjectProgressbarComponent', () => {
  let component: DashboardFeatureProjectProgressbarComponent;
  let fixture: ComponentFixture<DashboardFeatureProjectProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeatureProjectProgressbarComponent ],
      imports: [RouterTestingModule, NgbTooltipModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeatureProjectProgressbarComponent);
    component = fixture.componentInstance;
    component.dates = [];
    component.zones = [];
    component.colors  = {success: 'bg-success', error: 'bg-danger'};
    component.labels = {success: '', error: ''};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
