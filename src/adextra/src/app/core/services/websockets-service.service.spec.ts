import { TestBed } from '@angular/core/testing';

import { WebsocketsServiceService } from './websockets-service.service';

describe('WebsocketsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketsServiceService = TestBed.get(WebsocketsServiceService);
    expect(service).toBeTruthy();
  });
});
