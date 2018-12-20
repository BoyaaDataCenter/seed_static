import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysHeaderComponent } from './sys-header.component';

describe('SysHeaderComponent', () => {
  let component: SysHeaderComponent;
  let fixture: ComponentFixture<SysHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
