import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFeatureGanttComponent } from './scheduler-feature-gantt.component';

describe('SchedulerFeatureGanttComponent', () => {
  let component: SchedulerFeatureGanttComponent;
  let fixture: ComponentFixture<SchedulerFeatureGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFeatureGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFeatureGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
