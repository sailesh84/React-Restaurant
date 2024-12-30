import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {UsersService} from '@app/core/services/users.service';
import {ProfileFeatureComponent} from '@app/protected/profile/profile-feature/profile-feature.component';
import {ProjectsService} from '@app/core/services/projects.service';
import {ProfileFeatureCardComponent} from '@app/protected/profile/profile-feature-card/profile-feature-card.component';

describe('ProfileFeatureComponent', () => {
  let component: ProfileFeatureComponent;
  let fixture: ComponentFixture<ProfileFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFeatureComponent, ProfileFeatureCardComponent
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [UsersService, ProjectsService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFeatureComponent);
    component = fixture.componentInstance;
    // component.user =  USER;
    // component.projects = FIELDS;
    // component.accesses = ACCESSES;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
