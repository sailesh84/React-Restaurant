import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWaveComponent } from './current-wave.component';

describe('CurrentWaveComponent', () => {
  let component: CurrentWaveComponent;
  let fixture: ComponentFixture<CurrentWaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentWaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
