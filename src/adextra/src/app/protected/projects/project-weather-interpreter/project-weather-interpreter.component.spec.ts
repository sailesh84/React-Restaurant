import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWeatherInterpreterComponent } from './project-weather-interpreter.component';

describe('ProjectWeatherInterpreterComponent', () => {
  let component: ProjectWeatherInterpreterComponent;
  let fixture: ComponentFixture<ProjectWeatherInterpreterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWeatherInterpreterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWeatherInterpreterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
