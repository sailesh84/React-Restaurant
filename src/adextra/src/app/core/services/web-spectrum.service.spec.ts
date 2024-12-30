import { TestBed } from '@angular/core/testing';
import { WebSpectrumService } from './web-spectrum.service';

describe('WebSpectrumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSpectrumService = TestBed.get(WebSpectrumService);
    expect(service).toBeTruthy();
  });
});
