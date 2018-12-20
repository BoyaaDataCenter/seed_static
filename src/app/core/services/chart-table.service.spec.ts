import { TestBed, inject } from '@angular/core/testing';

import { ChartTableService } from './chart-table.service';

describe('ChartTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartTableService]
    });
  });

  it('should ...', inject([ChartTableService], (service: ChartTableService) => {
    expect(service).toBeTruthy();
  }));
});
