import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MutationStatsSummaryComponent } from "./mutation-stats-summary.component";

describe("MutationStatsSummaryComponent", () => {
  let component: MutationStatsSummaryComponent;
  let fixture: ComponentFixture<MutationStatsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutationStatsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutationStatsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
