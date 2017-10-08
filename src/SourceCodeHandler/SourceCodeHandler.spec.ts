import * as ts from "typescript";
import { expect } from "chai";
import { SourceCodeHandler } from "./SourceCodeHandler";

describe("Testing SourceCodeHandler", () => {
    const code = `
        let x: number = 3 + 9;
        const y: number = 11;
    `;
    const sourceObj = ts.createSourceFile("", code, ts.ScriptTarget.ES5, true);
    const sch: SourceCodeHandler = new SourceCodeHandler(sourceObj);

    beforeEach(() => {
    });

    it("Modyfing last plus sign to minus sign should work", () => {
        const index = sch.getOriginalSourceCode().indexOf("+");
        sch.modifyCode(index, index, "-");
        const actual = sch.getModifiedSourceCode();
        const expected = sch.getOriginalSourceCode().replace("+", "-");
        expect(actual).to.equal(expected);
    });

});
