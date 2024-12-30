import { TestBed } from '@angular/core/testing';

import { ExplanationsService } from './explanations.service';

describe('ExplanationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExplanationsService = TestBed.get(ExplanationsService);
    expect(service).toBeTruthy();
  });
});
