import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFeatureTableComponent } from './scheduler-feature-table.component';

describe('SchedulerFeatureTableComponent', () => {
  let component: SchedulerFeatureTableComponent;
  let fixture: ComponentFixture<SchedulerFeatureTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFeatureTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFeatureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
