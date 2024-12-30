import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ProfileFeatureCardComponent} from '@app/protected/profile/profile-feature-card/profile-feature-card.component';
import {FIELDS} from '@app/shared/mocks/mock-projects';
import {ACCESSES} from '@app/shared/mocks/mock-access';
import {FormsModule} from '@angular/forms';
import {UsersService} from '@app/core/services/users.service';
import {USER} from '@app/shared/mocks/mock-user';

describe('ProfileFeatureCardComponent', () => {
  let component: ProfileFeatureCardComponent;
  let fixture: ComponentFixture<ProfileFeatureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFeatureCardComponent
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [UsersService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFeatureCardComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.fields = FIELDS;
    component.accesses = ACCESSES;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
