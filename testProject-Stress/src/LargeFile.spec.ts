import { expect } from "chai";

import { LargeFile } from "./LargeFile";

describe("STRESS: Test Project LargeFile", () => {
    let large: LargeFile;
    beforeEach(() => {
        large = new LargeFile();
    });

    it("should return 100", () => {
        const expected = 100;
        const actual = large.add100Numbers();
        expect(actual).to.equal(expected);
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

    it("should return 0", () => {
        const expected = 44;
        const actual = large.inputs(20, 2);
        expect(actual).to.equal(expected);
    });

    it("should return 0", () => {
        const expected = 480;
        const actual = large.inputs(230, 10);
        expect(actual).to.equal(expected);
    });
});
