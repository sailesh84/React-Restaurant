import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeatureProjectCardComponent } from './dashboard-feature-project-card.component';
import {FIELDS} from '@app/shared/mocks/mock-projects';
import {RisksProgressbarDirective} from '@app/shared/directives/risks-progressbar.directive';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
// tslint:disable-next-line:max-line-length
import {DashboardFeatureProjectProgressbarComponent} from '@app/protected/dashboard/dashboard-feature-project-progressbar/dashboard-feature-project-progressbar.component';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

describe('DashboardFeatureProjectCardComponent', () => {
  let component: DashboardFeatureProjectCardComponent;
  let fixture: ComponentFixture<DashboardFeatureProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeatureProjectCardComponent, RisksProgressbarDirective, DashboardFeatureProjectProgressbarComponent ],
      imports: [RouterTestingModule, NgbTooltipModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeatureProjectCardComponent);
    component = fixture.componentInstance;
    component.field = FIELDS[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
