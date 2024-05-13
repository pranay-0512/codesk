import { TestBed } from '@angular/core/testing';

import { PalleteService } from './pallete.service';

describe('PalleteService', () => {
  let service: PalleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
