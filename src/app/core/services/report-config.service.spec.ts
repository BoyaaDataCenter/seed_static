import { TestBed, inject } from '@angular/core/testing';

import { ReportConfigService } from './report-config.service';

describe('ReportConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportConfigService]
    });
  });

  it('should be created', inject([ReportConfigService], (service: ReportConfigService) => {
    expect(service).toBeTruthy();
  }));
});
