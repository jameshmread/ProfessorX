import { expect } from "chai";

import { FileTwo } from "./FileTwo";

describe("File Two: More Complex mutations here", () => {
    let two: FileTwo;
    beforeEach(() => {
        two = new FileTwo();
    });

    it("inputting 10 should return even numbers upto 10", () => {
        const expected = [0, 2, 4, 6, 8, 10];
        const actual = two.getEvenNumbers(10);
        expect(actual).to.eql(expected);
    });
});
