import { expect } from "chai";

import { MathFunctions } from "./MathFunctions";

describe("Math functions", () => {
      beforeEach(() => {
      });

      it("for an array of size 0 it should return itself", () => {
            expect(MathFunctions.divideItemsAmongArrays([], 0).length).to.equal(0);
      });

      it("for an array of size 2 dividing into 2 it should return 2 arrays of length 1", () => {
            expect(MathFunctions.divideItemsAmongArrays([1, 2], 2)).to.eql([[1], [2]]);
      });

      it("for an array of size 10 dividing by 2 it should return 2 arrays of length 5", () => {
            const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expect(MathFunctions.divideItemsAmongArrays(inputArray, 2)[0].length).to.equal(5);
            expect(MathFunctions.divideItemsAmongArrays(inputArray, 2)[1].length).to.equal(5);
      });

      it("for an array of size 10 dividing by 1 it should return 1 array of length 10", () => {
            const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expect(MathFunctions.divideItemsAmongArrays(inputArray, 1)[0].length).to.equal(10);
      });

      it("should set runtime to a date format of 0,0,0,0,300 when given 300", () => {
            expect(MathFunctions.calculateRunTime(300)).to.eql({ d: 0, h: 0, m: 0, s: 0, ms: 300 });
      });

      it("should set runtime to 1,1,0,0,0 when given 90000000 (25 hours)", () => {
            expect(MathFunctions.calculateRunTime(90000000)).to.eql({ d: 1, h: 1, m: 0, s: 0, ms: 0 });
      });
});
