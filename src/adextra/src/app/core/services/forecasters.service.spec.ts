import { TestBed } from '@angular/core/testing';

import { ForecastersService } from './forecasters.service';

describe('ForecastersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForecastersService = TestBed.get(ForecastersService);
    expect(service).toBeTruthy();
  });
});
