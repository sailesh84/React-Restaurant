import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeatureInfoComponent } from './project-feature-info.component';

describe('ProjectFeatureInfoComponent', () => {
  let component: ProjectFeatureInfoComponent;
  let fixture: ComponentFixture<ProjectFeatureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFeatureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFeatureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
