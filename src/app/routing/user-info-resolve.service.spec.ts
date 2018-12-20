/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserInfoResolveService } from './user-info-resolve.service';

describe('UserInfoResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInfoResolveService]
    });
  });

  it('should ...', inject([UserInfoResolveService], (service: UserInfoResolveService) => {
    expect(service).toBeTruthy();
  }));
});
