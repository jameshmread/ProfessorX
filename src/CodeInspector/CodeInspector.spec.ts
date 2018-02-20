import { SourceFile, SyntaxKind } from "typescript";
import { expect } from "chai";

import { CodeInspector } from "./CodeInspector";
import { SpecificNodeFinder } from "../../testUtilities/SpecificNodeFinder";
import { SourceObjCreator } from "../../testUtilities/SourceObjCreator";

describe("Testing CodeInspector", () => {
    let code;
    let sourceObj: SourceFile;
    let ci: CodeInspector;
    let nodeFinder: SpecificNodeFinder;
    beforeEach(() => {
        code = `
        export class HelloWorldd {
            public sayHello (): void {
                let x: number = 3 + 9;
                const helloWorld = 'hello' + 'world';
                const y: number = 11;
                const z = x+y;
            }
        }
        `;
        sourceObj = new SourceObjCreator(code).sourceFile;
        ci = new CodeInspector(sourceObj);
        nodeFinder = new SpecificNodeFinder();
    });

    it("All plus signs are detected", () => {
        const actual = ci.findObjectsOfSyntaxKind(SyntaxKind.PlusToken);
        expect(actual.length).to.equal(2);
    });

    it("All binary expressions are detected", () => {
        const actual = ci.findObjectsOfSyntaxKind(SyntaxKind.BinaryExpression);
        expect(actual.length).to.equal(3);
    });

    it("2 plus signs are detected for mutation when 2 valid ones are placed", () => {
        const actual = ci.findObjectsOfSyntaxKind(SyntaxKind.PlusToken);
        expect(actual.length).to.equal(2);
    });

    it("should return length 1 when there is one function declaration", () => {
        const actual = ci.findObjectsOfSyntaxKind(SyntaxKind.MethodDeclaration);
        expect(actual.length).to.equal(1);
    });
});
