import { expect } from "chai";

import { FileOne } from "./FileOne";

describe("STRESS: Test Project addition function", () => {
    let one: FileOne;
    beforeEach(() => {
        one = new FileOne();
    });

    it("inputting 1 and 1 should return 2", () => {
        const expected = 2;
        const actual = one.addNumbers(1, 1);
        expect(actual).to.equal(expected);
    });

    it("inputting 1,1,1 should return 3", () => {
        const expected = 3;
        const actual = one.add3Numbers(1, 1, 1);
        expect(actual).to.equal(expected);
    });

    it("inputting 1 and 1 should return 0", () => {
        const expected = 0;
        const actual = one.takeAway(1, 1);
        expect(actual).to.equal(expected);
    });

    it("should always pass", () => {
        expect(one.truth()).to.equal(one.truth());
    });

    it("inputting hello and world should return helloworld", () => {
        const expected = "helloworld";
        const actual = one.helloStrings("hello", "world");
        expect(actual).to.equal(expected);
    });

    it("should return hello: 1", () => {
        const expected = "helloworld";
        const actual = one.helloStringLiteral();
        expect(actual).to.equal("hello: " + "1");
    });

});
