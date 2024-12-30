import { TestBed } from '@angular/core/testing';

import { ApplicationsAccessesService } from './applications-accesses.service';

describe('ApplicationsAccessesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationsAccessesService = TestBed.get(ApplicationsAccessesService);
    expect(service).toBeTruthy();
  });
});
