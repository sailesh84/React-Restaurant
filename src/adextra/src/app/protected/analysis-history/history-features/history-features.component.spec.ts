import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeaturesComponent } from './history-features.component';

describe('HistoryFeaturesComponent', () => {
  let component: HistoryFeaturesComponent;
  let fixture: ComponentFixture<HistoryFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
