import { TestBed } from '@angular/core/testing';

import { SchedulersService } from './schedulers.service';

describe('SchedulersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulersService = TestBed.get(SchedulersService);
    expect(service).toBeTruthy();
  });
});
