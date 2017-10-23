import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MutatedFilesSummaryComponent } from "./mutated-files-summary.component";

describe("MutatedFilesSummaryComponent", () => {
  let component: MutatedFilesSummaryComponent;
  let fixture: ComponentFixture<MutatedFilesSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutatedFilesSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutatedFilesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
