import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFeatureViewComponent } from './scheduler-feature-view.component';

describe('SchedulerFeatureViewComponent', () => {
  let component: SchedulerFeatureViewComponent;
  let fixture: ComponentFixture<SchedulerFeatureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFeatureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFeatureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
