import { expect } from "chai";

import { OutputToJSON } from "./OutputToJSON";

describe("output to json", () => {
    let output: OutputToJSON;
    beforeEach(() => {
        output = new OutputToJSON();
    });

    it("should be defined", () => {
        expect(output).to.not.equal(void 0);
    });
});
