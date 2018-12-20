import { TestBed, inject } from '@angular/core/testing';

import { ReportPageService } from './report-page.service';

describe('ReportPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportPageService]
    });
  });

  it('should be created', inject([ReportPageService], (service: ReportPageService) => {
    expect(service).toBeTruthy();
  }));
});
