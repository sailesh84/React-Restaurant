import { TestBed } from '@angular/core/testing';

import { TitlePageService } from './title-page.service';

describe('TitlePageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TitlePageService = TestBed.get(TitlePageService);
    expect(service).toBeTruthy();
  });
});
