import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeatureSummaryComponent } from './history-feature-summary.component';

describe('HistoryFeatureSummaryComponent', () => {
  let component: HistoryFeatureSummaryComponent;
  let fixture: ComponentFixture<HistoryFeatureSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeatureSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeatureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
