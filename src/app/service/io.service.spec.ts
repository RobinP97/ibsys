import { IoService } from './io.service';
import { TestBed } from '@angular/core/testing';

describe('IoService', () => {
  let service: IoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
