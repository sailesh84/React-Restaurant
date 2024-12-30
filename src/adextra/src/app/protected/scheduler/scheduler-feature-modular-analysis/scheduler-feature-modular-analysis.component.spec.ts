import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerFeatureModularAnalysisComponent } from './scheduler-feature-modular-analysis.component';

describe('SchedulerFeatureTableComponent', () => {
  let component: SchedulerFeatureModularAnalysisComponent;
  let fixture: ComponentFixture<SchedulerFeatureModularAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerFeatureModularAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerFeatureModularAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
