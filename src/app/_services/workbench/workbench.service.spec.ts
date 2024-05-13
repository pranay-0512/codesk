import { TestBed } from '@angular/core/testing';

import { WorkbenchService } from './workbench.service';

describe('WorkbenchService', () => {
  let service: WorkbenchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkbenchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
