import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportQueryComponent } from './report-query.component';

describe('ReportQueryComponent', () => {
  let component: ReportQueryComponent;
  let fixture: ComponentFixture<ReportQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
