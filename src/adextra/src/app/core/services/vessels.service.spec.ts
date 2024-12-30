import { TestBed } from '@angular/core/testing';

import { VesselsService } from './vessels.service';

describe('VesselsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VesselsService = TestBed.get(VesselsService);
    expect(service).toBeTruthy();
  });
});
