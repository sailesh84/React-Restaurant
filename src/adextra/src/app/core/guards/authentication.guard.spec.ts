import {getTestBed, TestBed} from '@angular/core/testing';

import { AuthenticationGuard } from './authentication.guard';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {Router} from '@angular/router';

describe('AuthenticationGuard', () => {
  const routeMock: any = { snapshot: {}};
  const routeStateMock: any = { snapshot: {}, url: '/dashboard'};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => TestBed.configureTestingModule({
    providers: [AuthenticationGuard, AuthenticationService, { provide: Router, useValue: routerMock }]
  }));

  it('should be created', () => {
    const guard: AuthenticationGuard = TestBed.get(AuthenticationGuard);
    expect(guard).toBeTruthy();
  });

  it('should return true for a logged in user', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    // service.login();
    const guard: AuthenticationGuard = TestBed.get(AuthenticationGuard);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });

  it('should redirect an unauthenticated user to the login route', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    service.logout();
    const guard: AuthenticationGuard = TestBed.get(AuthenticationGuard);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: routeStateMock.url }});
  });
});

