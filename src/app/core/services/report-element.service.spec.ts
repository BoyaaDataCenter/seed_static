import { TestBed, inject } from '@angular/core/testing';

import { ReportElementService } from './report-element.service';

describe('ReportElementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportElementService]
    });
  });

  it('should be created', inject([ReportElementService], (service: ReportElementService) => {
    expect(service).toBeTruthy();
  }));
});
