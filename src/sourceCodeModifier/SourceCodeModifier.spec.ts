import * as ts from "typescript";
import { expect } from "chai";
import { SourceCodeModifier } from "./SourceCodeModifier";
import { SourceObject } from "../../DTOs/SourceObject";
import { MutatableNode } from "../../DTOs/MutatableNode";
import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { SyntaxKind } from "typescript";

describe("Testing SourceCodeHandler", () => {
    let code: string;
    let sourceObj: SourceObject;
    let codeModifier: SourceCodeModifier;
    let currentNode: IMutatableNode;
    beforeEach(() => {
        code = `
            let x: number = 3 + 9;
            const y: boolean = true;
        `;
        sourceObj = new SourceObject(ts.createSourceFile("", code, ts.ScriptTarget.ES5, true));
        codeModifier = new SourceCodeModifier(sourceObj);
    });

    it("Modyfing last plus sign to minus sign should work", () => {
        const index = codeModifier.getOriginalSourceCode().indexOf("+");
        currentNode = new MutatableNode(null, {pos: index, end: index + 1}, null, "", "", "");
        codeModifier.modifyCode(currentNode, "-");
        const actual = codeModifier.getModifiedSourceCode();
        const expected = codeModifier.getOriginalSourceCode().replace("+", " -");
        expect(actual).to.equal(expected);
    });

    it("Modyfing true to false should work", () => {
        const index = codeModifier.getOriginalSourceCode().indexOf("true");
        currentNode = new MutatableNode(null, {pos: index, end: index + 4}, null, "", "", "");
        codeModifier.modifyCode(currentNode, "false");
        const actual = codeModifier.getModifiedSourceCode();
        const expected = codeModifier.getOriginalSourceCode().replace("true", " false");
        expect(actual).to.equal(expected);
    });

    it("should return true when given two different strings", () => {
        expect(codeModifier.isModificationDifferentFromSource("Hello", "World")).to.equal(true);
    });

    it("should return false when given two different strings", () => {
        expect(codeModifier.isModificationDifferentFromSource("Hello", "Hello")).to.equal(false);
    });

    it("should return false when given two strings which differ only in whitespace", () => {
        expect(codeModifier.isModificationDifferentFromSource("Hello ", "Hello")).to.equal(false);
    });

    it("should return false when given two strings which differ only in whitespace inside a function", () => {
        expect(codeModifier.isModificationDifferentFromSource("functionName(0)", "functionName( 0)")).to.equal(false);
    });

});
