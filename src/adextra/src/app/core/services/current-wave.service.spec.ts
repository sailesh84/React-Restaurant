import { TestBed } from '@angular/core/testing';

import { CurrentWaveService } from './current-wave.service';

describe('CurrentWaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentWaveService = TestBed.get(CurrentWaveService);
    expect(service).toBeTruthy();
  });
});
