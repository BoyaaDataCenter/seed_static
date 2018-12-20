import { TestBed, inject } from '@angular/core/testing';

import { RoleMenuService } from './role-menu.service';

describe('RoleMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleMenuService]
    });
  });

  it('should be created', inject([RoleMenuService], (service: RoleMenuService) => {
    expect(service).toBeTruthy();
  }));
});
