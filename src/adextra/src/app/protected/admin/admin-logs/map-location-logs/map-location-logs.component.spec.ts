import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MapLocationLogsComponent} from './modal-location-logs.component';

describe('LogsComponent', () => {
  let component: MapLocationLogsComponent;
  let fixture: ComponentFixture<MapLocationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLocationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLocationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
