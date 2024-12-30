import { TestBed } from '@angular/core/testing';

import { VesselsTypesService } from './vessels-types.service';

describe('VesselTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VesselsTypesService = TestBed.get(VesselsTypesService);
    expect(service).toBeTruthy();
  });
});
