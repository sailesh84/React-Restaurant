import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UsersService]
  }));

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });

  it('should return the user of id 1', () => {
    const service: UsersService = TestBed.get(UsersService);
    service.getUser('1').subscribe(data => {
      expect(data.data._id).toBe('1');
    });
  });
});

