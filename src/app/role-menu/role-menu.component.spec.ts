import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenuComponent } from './role-menu.component';

describe('RoleMenuComponent', () => {
  let component: RoleMenuComponent;
  let fixture: ComponentFixture<RoleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
