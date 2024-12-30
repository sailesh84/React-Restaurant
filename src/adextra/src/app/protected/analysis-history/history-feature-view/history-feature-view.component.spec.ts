import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeatureViewComponent } from './history-feature-view.component';

describe('HistoryFeatureViewComponent', () => {
  let component: HistoryFeatureViewComponent;
  let fixture: ComponentFixture<HistoryFeatureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeatureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeatureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
