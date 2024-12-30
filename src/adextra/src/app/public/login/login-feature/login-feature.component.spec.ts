import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFeatureComponent } from './login-feature.component';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from '@app/core/services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginFeatureComponent', () => {
  let component: LoginFeatureComponent;
  let fixture: ComponentFixture<LoginFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFeatureComponent ],
      imports: [FormsModule, RouterTestingModule],
      providers: [AuthenticationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect a logged in user', () => {
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    authService.login({username: '', password: '', type: ''});
    expect(authService.isLogged).toEqual(true);
  });

  it('should valid the login form', () => {
    component.model.username = 'admin';
    component.model.password = 'admin';
    fixture.detectChanges();
    component.onSubmit();
    expect(component.submitted).toEqual(true);
  });

  it('should invalid the login form', () => {
    component.onSubmit();
    expect(component.submitted).toEqual(false);
  });
});
