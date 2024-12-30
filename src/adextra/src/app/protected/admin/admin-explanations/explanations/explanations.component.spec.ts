import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationsComponent } from './explanations.component';

describe('ExplanationsComponent', () => {
  let component: ExplanationsComponent;
  let fixture: ComponentFixture<ExplanationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplanationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
