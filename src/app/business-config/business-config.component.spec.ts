import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessConfigComponent } from './business-config.component';

describe('BusinessConfigComponent', () => {
  let component: BusinessConfigComponent;
  let fixture: ComponentFixture<BusinessConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
