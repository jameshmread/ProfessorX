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

    it("should return false when given an empty string input", () => {
        expect(numLit.isNodeValidForMutation("f222n2")).to.equal(false);
    });

});
