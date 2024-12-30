import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeatureForecastsComponent } from './history-feature-forecasts.component';

describe('HistoryFeatureForecastsComponent', () => {
  let component: HistoryFeatureForecastsComponent;
  let fixture: ComponentFixture<HistoryFeatureForecastsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeatureForecastsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeatureForecastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
