import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AuthenticationService]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  // it('should be logged in', () => {
  //   const service: AuthenticationService = TestBed.get(AuthenticationService);
  //   service.login();
  //   expect(service.isLogged()).toBe(true);
  // });
  //
  // it('should be logged out', () => {
  //   const service: AuthenticationService = TestBed.get(AuthenticationService);
  //   service.logout();
  //   expect(service.isLogged()).toBe(false);
  // });
});

