import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeaturesComponent } from './dashboard-features.component';
import {ProjectsService} from '@app/core/services/projects.service';
// tslint:disable-next-line:max-line-length
import {DashboardFeatureProjectCardComponent} from '@app/protected/dashboard/dashboard-feature-project-card/dashboard-feature-project-card.component';
import {DashboardMapCardComponent} from '@app/protected/dashboard/dashboard-map-card/dashboard-map-card.component';
import {RisksProgressbarDirective} from '@app/shared/directives/risks-progressbar.directive';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('DashboardFeaturesComponent', () => {
  let component: DashboardFeaturesComponent;
  let fixture: ComponentFixture<DashboardFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeaturesComponent, DashboardFeatureProjectCardComponent,
        DashboardMapCardComponent , RisksProgressbarDirective
      ],
      imports: [RouterTestingModule],
      providers: [ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
