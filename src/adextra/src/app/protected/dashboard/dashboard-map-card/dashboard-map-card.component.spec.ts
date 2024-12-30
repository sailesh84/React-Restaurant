import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMapCardComponent } from './dashboard-map-card.component';
import {FIELDS} from '@app/shared/mocks/mock-projects';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

describe('DashboardMapCardComponent', () => {
  let component: DashboardMapCardComponent;
  let fixture: ComponentFixture<DashboardMapCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMapCardComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMapCardComponent);
    component = fixture.componentInstance;
    component.markers = FIELDS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
