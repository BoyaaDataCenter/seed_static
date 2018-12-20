import { TestBed, inject } from '@angular/core/testing';

import { SetService } from './set.service';

describe('SetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetService]
    });
  });

  it('should ...', inject([SetService], (service: SetService) => {
    expect(service).toBeTruthy();
  }));
});
