import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeatureProjectUpatedDateComponent } from './dashboard-feature-project-upated-date.component';

describe('DashboardFeatureProjectUpatedDateComponent', () => {
  let component: DashboardFeatureProjectUpatedDateComponent;
  let fixture: ComponentFixture<DashboardFeatureProjectUpatedDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFeatureProjectUpatedDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFeatureProjectUpatedDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
