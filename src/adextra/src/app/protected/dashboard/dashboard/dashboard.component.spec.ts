import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {DashboardFeaturesComponent} from '@app/protected/dashboard/dashboard-features/dashboard-features.component';
// tslint:disable-next-line:max-line-length
import {DashboardFeatureProjectCardComponent} from '@app/protected/dashboard/dashboard-feature-project-card/dashboard-feature-project-card.component';
import {DashboardMapCardComponent} from '@app/protected/dashboard/dashboard-map-card/dashboard-map-card.component';
import {RisksProgressbarDirective} from '@app/shared/directives/risks-progressbar.directive';
import {ProjectsService} from '@app/core/services/projects.service';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, DashboardFeaturesComponent, DashboardFeatureProjectCardComponent,
        DashboardMapCardComponent, RisksProgressbarDirective
      ],
      imports: [RouterTestingModule],
      providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
