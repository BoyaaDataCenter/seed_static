import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportConfigComponent } from './report-config.component';

describe('ReportConfigComponent', () => {
  let component: ReportConfigComponent;
  let fixture: ComponentFixture<ReportConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
