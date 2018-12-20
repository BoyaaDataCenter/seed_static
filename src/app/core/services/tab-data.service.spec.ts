import { TestBed, inject } from '@angular/core/testing';

import { TabDataService } from './tab-data.service';

describe('TabDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabDataService]
    });
  });

  it('should ...', inject([TabDataService], (service: TabDataService) => {
    expect(service).toBeTruthy();
  }));
});
