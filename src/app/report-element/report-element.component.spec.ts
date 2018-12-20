import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportElementComponent } from './report-element.component';

describe('ReportElementComponent', () => {
  let component: ReportElementComponent;
  let fixture: ComponentFixture<ReportElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
