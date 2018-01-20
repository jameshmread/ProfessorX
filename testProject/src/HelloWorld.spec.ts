import { expect } from "chai";

import { HelloWorld } from "./HelloWorld";

describe("Test Project addition function", () => {
    let hello: HelloWorld;
    beforeEach(() => {
        hello = new HelloWorld();
    });

    it("inputting 1 and 1 should return 2", () => {
        const expected = 2;
        const actual = hello.addNumbers(1, 1);
        expect(actual).to.equal(expected);
    });

    it("inputting 1,1,1 should return 3", () => {
        const expected = 3;
        const actual = hello.add3Numbers(1, 1, 1);
        expect(actual).to.equal(expected);
    });

    it("inputting 1 and 1 should return 0", () => {
        const expected = 0;
        const actual = hello.takeAway(1, 1);
        expect(actual).to.equal(expected);
    });

    it("should always pass", () => {
        expect(hello.truth()).to.equal(hello.truth());
    });

    it("inputting hello and world should return helloworld", () => {
        const expected = "helloworld";
        const actual = hello.helloStrings("hello", "world");
        expect(actual).to.equal(expected);
    });

});
