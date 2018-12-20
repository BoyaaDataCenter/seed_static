import { TestBed, inject } from '@angular/core/testing';

import { BusinessConfigService } from './business-config.service';

describe('BusinessConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessConfigService]
    });
  });

  it('should be created', inject([BusinessConfigService], (service: BusinessConfigService) => {
    expect(service).toBeTruthy();
  }));
});
