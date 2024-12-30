import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFeaturesComponent } from './scheduler-features.component';

describe('SchedulerFeaturesComponent', () => {
  let component: SchedulerFeaturesComponent;
  let fixture: ComponentFixture<SchedulerFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
