import { expect } from "chai";
import { NumericLiteral } from "./NumericLiteral";

describe("Numeric Literal", () => {

    let numLit: NumericLiteral;
    beforeEach(() => {
        numLit = new NumericLiteral(null);
    });

    it("should return true when given a number as a string input", () => {
        expect(numLit.isNodeValidForMutation("6")).to.equal(true);
    });

    it("should return true when given a flaoat as a string input", () => {
        expect(numLit.isNodeValidForMutation("67.422")).to.equal(true);
    });

    it("should return false when given a plus symbol as a string input", () => {
        expect(numLit.isNodeValidForMutation("+")).to.equal(false);
    });

    it("should return false when given an empty string input", () => {
        expect(numLit.isNodeValidForMutation("")).to.equal(false);
    });

    it("should return false when given a random string input", () => {
        expect(numLit.isNodeValidForMutation("f222n2")).to.equal(false);
    });

    it("should return 11 when given 10 as an input", () => {
        numLit = new NumericLiteral("10");
        expect(numLit.addOne()).to.equal("11");
    });

    it("should return 9 when given 10 as an input", () => {
        numLit = new NumericLiteral("10");
        expect(numLit.minusOne()).to.equal("9");
    });

    it("should return -10 when given 10 as an input", () => {
        numLit = new NumericLiteral("10");
        expect(numLit.multiplyByNegative()).to.equal("-10");
    });

    it("should return 3 when given 10 as an input and 3 as the set value", () => {
        numLit = new NumericLiteral("10");
        expect(numLit.setToValue(3)).to.equal("3");
    });

    it("should return an array of when given 10", () => {
        numLit = new NumericLiteral("10");
        expect(numLit.getComplexMutation().mutations).to.eql(["11", "9", "-10", "0", "1", "-1"]);
    });

});
