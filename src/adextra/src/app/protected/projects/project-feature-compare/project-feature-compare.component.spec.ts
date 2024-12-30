import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeatureCompareComponent } from './project-feature-compare.component';

describe('ProjectFeatureCompareComponent', () => {
  let component: ProjectFeatureCompareComponent;
  let fixture: ComponentFixture<ProjectFeatureCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFeatureCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFeatureCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
