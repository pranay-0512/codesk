import { TestBed } from '@angular/core/testing';

import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
  let service: EllipseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EllipseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
