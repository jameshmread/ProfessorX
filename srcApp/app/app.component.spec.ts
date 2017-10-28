import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
describe("AppComponent", () => {
  let component;
  beforeEach(() => {
    component = new AppComponent();
  });

  it("should return 1 when given [true, false]", () => {
    expect(component.getKilledMutants([true, false])).toEqual(1);
  });

  it("should return 2 when given [true, true]", () => {
    expect(component.getKilledMutants([true, true])).toEqual(2);
  });

  it("should return 0 when given [false, false]", () => {
    expect(component.getKilledMutants([false, false])).toEqual(0);
  });

  it("should return 2 when given [false, true, true]", () => {
    expect(component.getKilledMutants([false, true, true])).toEqual(2);
  });
});
