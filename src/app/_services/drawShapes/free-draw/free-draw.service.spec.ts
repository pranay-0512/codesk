import { TestBed } from '@angular/core/testing';

import { FreeDrawService } from './free-draw.service';

describe('FreeDrawService', () => {
  let service: FreeDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
