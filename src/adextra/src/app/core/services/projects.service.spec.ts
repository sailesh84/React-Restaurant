import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ProjectsService]
  }));

  it('should be created', () => {
    const service: ProjectsService = TestBed.get(ProjectsService);
    expect(service).toBeTruthy();
  });

  it('should return an array of field object', () => {
    const service: ProjectsService = TestBed.get(ProjectsService);
    service.getFields().subscribe(data => {
      expect(Array.isArray(data)).toBe(true);
    });
  });
});

