import * as ts from "typescript";
import { expect } from "chai";
import { CodeInspector } from "./CodeInspector";
import { SourceFile, SyntaxKind } from "typescript";

describe("Testing CodeInspector", () => {
    let code;
    let sourceObj: SourceFile;
    let ci: CodeInspector;
    beforeEach(() => {
        code = `
            let x: number = 3 + 9;
            const helloWorld = 'hello' + 'world';
            const y: number = 11;
            const z = x+y;
        `;
        sourceObj = ts.createSourceFile("", code, ts.ScriptTarget.ES5, true);
        ci = new CodeInspector(sourceObj);
    });

    it("All plus signs are detected", () => {
        const actual = ci.findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken);
        expect(actual.length).to.equal(2);
    });

    it("All binary expressions are detected", () => {
        const actual = ci.findObjectsOfSyntaxKind(ts.SyntaxKind.BinaryExpression);
        expect(actual.length).to.equal(3);
    });

    it("should return false when + token is between two strings", () => {
        code = "'hello' + 'world';";
        sourceObj = ts.createSourceFile("", code, ts.ScriptTarget.ES5, true);
        ci = new CodeInspector(sourceObj);

        const x = findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken, sourceObj);
        const plusNode: ts.Node = x[0];
        const actual = CodeInspector.checkNodeIsMutatable(plusNode);
        expect(actual).to.equal(false);
    });

    it("should return true when + token is between two numbers", () => {
        code = "2 + 2;";
        sourceObj = ts.createSourceFile("", code, ts.ScriptTarget.ES5, true);
        ci = new CodeInspector(sourceObj);

        const x = findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken, sourceObj);
        const plusNode: ts.Node = x[0];
        const actual = CodeInspector.checkNodeIsMutatable(plusNode);
        expect(actual).to.equal(true);
    });

    it("2 plus signs are detected for mutation when 2 valid ones are placed", () => {
        const actual = ci.findObjectsOfSyntaxKind(ts.SyntaxKind.PlusToken);
        expect(actual.length).to.equal(2);
    });
});

let retrievedObjects;
function findObjectsOfSyntaxKind (kind: SyntaxKind, sourceObject) {
    retrievedObjects = [];
    return findTokenObjectsOfKind(sourceObject, kind);
}

function findTokenObjectsOfKind (object: ts.Node, kind: SyntaxKind) {
    if (object.kind === kind) {
        retrievedObjects.push(object);
    }
    object.forEachChild((element) => {
        findTokenObjectsOfKind(element, kind);
    });
    return retrievedObjects;
}

