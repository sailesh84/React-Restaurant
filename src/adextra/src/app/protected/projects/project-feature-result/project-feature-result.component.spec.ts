import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeatureResultComponent } from './project-feature-result.component';

describe('ProjectFeatureResultComponent', () => {
  let component: ProjectFeatureResultComponent;
  let fixture: ComponentFixture<ProjectFeatureResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFeatureResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFeatureResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
