import { TestBed } from '@angular/core/testing';

import { UserSharingService } from './user-sharing.service';

describe('UserSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSharingService = TestBed.get(UserSharingService);
    expect(service).toBeTruthy();
  });
});
