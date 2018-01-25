import * as ts from "typescript";
import { expect } from "chai";
import { SourceCodeHandler } from "./SourceCodeHandler";
import { SourceObject } from "../../DTOs/SourceObject";
import { MutatableNode } from "../../DTOs/MutatableNode";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { SyntaxKind } from "typescript";

describe("Testing SourceCodeHandler", () => {
    let code: string;
    let sourceObj: SourceObject;
    let sch: SourceCodeHandler;
    let currentNode: IMutatableNode;
    beforeEach(() => {
        code = `
            let x: number = 3 + 9;
            const y: boolean = true;
        `;
        sourceObj = new SourceObject(ts.createSourceFile("", code, ts.ScriptTarget.ES5, true));
        sch = new SourceCodeHandler(sourceObj);
    });

    it("Modyfing last plus sign to minus sign should work", () => {
        const index = sch.getOriginalSourceCode().indexOf("+");
        currentNode = new MutatableNode(null, {pos: index, end: index + 1}, null);
        sch.modifyCode(currentNode, "-");
        const actual = sch.getModifiedSourceCode();
        const expected = sch.getOriginalSourceCode().replace("+", " -");
        expect(actual).to.equal(expected);
    });

    it("Modyfing true to false should work", () => {
        const index = sch.getOriginalSourceCode().indexOf("true");
        currentNode = new MutatableNode(null, {pos: index, end: index + 4}, null);
        sch.modifyCode(currentNode, "false");
        const actual = sch.getModifiedSourceCode();
        const expected = sch.getOriginalSourceCode().replace("true", " false");
        expect(actual).to.equal(expected);
    });

});
