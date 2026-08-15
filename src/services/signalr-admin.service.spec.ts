import { TestBed } from '@angular/core/testing';

import { SignalrAdminService } from './signalr-admin.service';

describe('SignalrAdminService', () => {
  let service: SignalrAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
