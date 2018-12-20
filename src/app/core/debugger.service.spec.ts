import { TestBed, inject } from '@angular/core/testing';

import { DebuggerService } from './debugger.service';

describe('DebuggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebuggerService]
    });
  });

  it('should be created', inject([DebuggerService], (service: DebuggerService) => {
    expect(service).toBeTruthy();
  }));
});
