import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeatureContactCardComponent } from './project-feature-contact-card.component';

describe('ProjectFeatureContactCardComponent', () => {
  let component: ProjectFeatureContactCardComponent;
  let fixture: ComponentFixture<ProjectFeatureContactCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFeatureContactCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFeatureContactCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
