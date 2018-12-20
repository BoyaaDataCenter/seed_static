import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysUserListComponent } from './sys-user-list.component';

describe('SysUserListComponent', () => {
  let component: SysUserListComponent;
  let fixture: ComponentFixture<SysUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
