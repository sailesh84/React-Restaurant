import { TestBed } from '@angular/core/testing';

import { ProfilerService } from './profiler.service';

describe('ProfilerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilerService = TestBed.get(ProfilerService);
    expect(service).toBeTruthy();
  });
});
