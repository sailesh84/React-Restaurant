import { TestBed } from '@angular/core/testing';
import { AlphaFactorService } from './alpha-factor.service';

describe('AlphaFactorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: AlphaFactorService = TestBed.get(AlphaFactorService);
    expect(service).toBeTruthy();
  });
});