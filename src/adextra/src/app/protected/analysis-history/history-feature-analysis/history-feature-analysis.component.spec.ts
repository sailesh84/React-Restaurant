import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeatureAnalysisComponent } from './history-feature-analysis.component';

describe('HistoryFeatureAnalysisComponent', () => {
  let component: HistoryFeatureAnalysisComponent;
  let fixture: ComponentFixture<HistoryFeatureAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeatureAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeatureAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
