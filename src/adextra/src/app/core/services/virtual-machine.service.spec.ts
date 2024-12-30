import { TestBed } from '@angular/core/testing';

import { VirtualMachineService } from './virtual-machine.service';

describe('VirtualMachineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualMachineService = TestBed.get(VirtualMachineService);
    expect(service).toBeTruthy();
  });
});
