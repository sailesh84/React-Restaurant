import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerLogsInfoComponent } from './scheduler-logs-info.component';

describe('SchedulerLogsInfoComponent', () => {
  let component: SchedulerLogsInfoComponent;
  let fixture: ComponentFixture<SchedulerLogsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerLogsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerLogsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
