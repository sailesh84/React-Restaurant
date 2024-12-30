import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastersComponent } from './forecasters.component';

describe('ForecastersComponent', () => {
  let component: ForecastersComponent;
  let fixture: ComponentFixture<ForecastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
