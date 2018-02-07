import { expect } from "chai";

import { LargeFile } from "./LargeFile";

describe("STRESS: Test Project LargeFile", () => {
    let large: LargeFile;
    beforeEach(() => {
        large = new LargeFile();
    });

    it("should return 302", () => {
        const expected = 302;
        const actual = large.add200Numbers(1, 2);
        expect(actual).to.equal(expected);
    });

    it("should return +ve number", () => {
        const actual = large.add200Numbers(1, 2);
        const expected = actual > 0;
        expect(expected).to.equal(true);
    });

    it("should return -1182", () => {
        const expected = -1182;
        const actual = large.minus200Numbers(10, 2);
        expect(actual).to.equal(expected);
    });

    it("should return -1182", () => {
        const expected = -3053080;
        const actual = large.minus200NumbersTimesPlus200Numbers(10, 2, -5, 30);
        expect(actual).to.equal(expected);
    });

    it("should return -1182", () => {
        const actual = large.nodes800(10, 2, -4, 2);
        const expected = actual > 0;
        expect(expected).to.equal(true);
    });

    it("should return true", () => {
        const expected = true;
        const actual = large.moreComplexExpression();
        expect(actual).to.equal(expected);
    });

    it("should return 0", () => {
        const expected = 0;
        const actual = large.return0();
        expect(actual).to.equal(expected);
    });

    it("should return 44 with 20 and 2 inputs", () => {
        const expected = 44;
        const actual = large.inputs(20, 2);
        expect(actual).to.equal(expected);
    });

    it("should return 480 with inputs 230 and 10", () => {
        const expected = 480;
        const actual = large.inputs(230, 10);
        expect(actual).to.equal(expected);
    });
});
