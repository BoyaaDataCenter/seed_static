/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeyDataService } from './key-data.service';

describe('KeyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyDataService]
    });
  });

  it('should ...', inject([KeyDataService], (service: KeyDataService) => {
    expect(service).toBeTruthy();
  }));
});
