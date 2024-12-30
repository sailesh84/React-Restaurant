import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFeatureInfoComponent } from './project-feature-info.component';

describe('ProjectFeatureInfoComponent', () => {
  let component: HistoryFeatureInfoComponent;
  let fixture: ComponentFixture<HistoryFeatureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFeatureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFeatureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
