import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MutationFiltersComponent } from "./mutation-filters.component";

describe("MutationFiltersComponent", () => {

      let mfc: MutationFiltersComponent;
      beforeEach( () => {
            mfc = new MutationFiltersComponent();
      });

      it("source files dropdown length should be 2 with 1 src file", () => {
            mfc.srcFiles = ["length1"];
            expect(mfc.sourceFilesDropDown.length).toEqual(1);
            mfc.addSourceFileDropdownOptions();
            expect(mfc.sourceFilesDropDown.length).toEqual(2);
      });
});
