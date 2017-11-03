import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MutationStatsSummaryComponent } from "./mutation-stats-summary.component";

describe("MutationStatsSummaryComponent", () => {
  let component: MutationStatsSummaryComponent;
  let fixture: ComponentFixture<MutationStatsSummaryComponent>;
  let mssc: MutationStatsSummaryComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutationStatsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mssc = new MutationStatsSummaryComponent();
    fixture = TestBed.createComponent(MutationStatsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("totalmScore should = 100 given 1 killed and 0 surviving", () => {
    mssc.killedMutants = 1;
    mssc.survivingMutants = 0;
    mssc.setMutationScore();
    expect(mssc.totalMutationScore).toEqual(100);
  });

  it("totalmScore should = 0 given 0 killed and 1 surviving", () => {
    mssc.killedMutants = 0;
    mssc.survivingMutants = 1;
    mssc.setMutationScore();
    expect(mssc.totalMutationScore).toEqual(0);
  });

  it("totalmScore should = 50 given 1 killed and 1 surviving", () => {
    mssc.killedMutants = 1;
    mssc.survivingMutants = 1;
    mssc.setMutationScore();
    expect(mssc.totalMutationScore).toEqual(50);
  });

  it("totalmScore should = 50 given 1 killed and 1 surviving", () => {
    mssc.killedMutants = 1;
    mssc.survivingMutants = 1;
    mssc.setMutationScore();
    expect(mssc.totalMutationScore).toEqual(50);
  });

  it("should return 1 when given [true, false]", () => {
    expect(mssc.getKilledMutants([true, false])).toEqual(1);
  });

  it("should return 2 when given [true, true]", () => {
    expect(mssc.getKilledMutants([true, true])).toEqual(2);
  });

  it("should return 0 when given [false, false]", () => {
    expect(mssc.getKilledMutants([false, false])).toEqual(0);
  });

  it("should return 2 when given [false, true, true]", () => {
    expect(mssc.getKilledMutants([false, true, true])).toEqual(2);
  });
});
