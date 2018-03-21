import { expect } from "chai";

import { ITestResult } from "../../interfaces/ITestResult";
import { MutationResultManager } from "./MutationResultManager";
import { MutationResult } from "../../DTOs/MutationResult";
import { SourceCodeModifier } from "../sourceCodeModifier/SourceCodeModifier";
import { SourceObjCreator } from "../../testUtilities/SourceObjCreator";
import { SourceObject } from "../../DTOs/SourceObject";

describe("Mutation Result Manager", () => {
    let mutationResult: MutationResult;
    let mResultManager: MutationResultManager;
    const origionalCode = `export class HelloWorld {
        public addNumbers (a: number, b: number) {
            return a + b;
        }
    }`;
    const functionArray = [
        {lineText: "        public addNumbers (a: number, b: number) {",
        lineNumber: 1},
        {lineText: "            return a + b;",
        lineNumber: 2},
        {lineText: "        }",
        lineNumber: 3}];
    let testResult: ITestResult;

    beforeEach(() => {
        mResultManager = new MutationResultManager();
        mResultManager.setCurrentSourceCodeModifierAndSourceObj(
            new SourceCodeModifier(
                new SourceObject(new SourceObjCreator(origionalCode).sourceFile))
            );
        mutationResult = new MutationResult("./TestPath", "SourceFileName.ts");
        mResultManager.setCurrentMutationResult(mutationResult);
        testResult = {passed: "0", failed: "2", totalRan: "0", duration: "20"};
    });

    it("should get a list of one method when the code contains one", () => {
        const methodNames = mResultManager.getAllMethodNames();
        expect(methodNames.length).to.eql(1);
    });

    it("should get a list of two methods when the code contains two", () => {
        const twoMethodCode = `export class HelloWorld {
            public addNumbers (a: number, b: number) {}
            public addNumbersss (a: number, b: number) {}
        }`;
        mResultManager.setCurrentSourceCodeModifierAndSourceObj(
            new SourceCodeModifier(
                new SourceObject(new SourceObjCreator(twoMethodCode).sourceFile))
            );
        const methodNames = mResultManager.getAllMethodNames();
        expect(methodNames.length).to.eql(2);
        });

    it("should return one when the mutation is inside the function and there is one function", () => {
        const singleFunction = `export class hey {
        public addNumbers (a: number, b: number) {
            const x = "mutation";
        }
        }`;
        mResultManager.setCurrentSourceCodeModifierAndSourceObj(
            new SourceCodeModifier(
                new SourceObject(new SourceObjCreator(singleFunction).sourceFile))
        );
        const methodNames = mResultManager.getParentMethodBoundsOfMutatedLine(63);
        expect(methodNames).to.eql({pos: 20, end: 113});
    });

    it("should return correct parent bounds when mutation is inside a function with 3 functions", () => {
        const singleFunction = `export class hey {
        public func1 (a: number, b: number) {
            const x = "mutation";
        }
        public func2 (a: number, b: number) {
            const x = "mutation";
        }
        public func3 (a: number, b: number) {
            const x = "mutation";
        }
        }`;
        mResultManager.setCurrentSourceCodeModifierAndSourceObj(
            new SourceCodeModifier(
                new SourceObject(new SourceObjCreator(singleFunction).sourceFile))
        );
        const methodNames = mResultManager.getParentMethodBoundsOfMutatedLine(120);
        expect(methodNames).to.eql({pos: 110, end: 198});
    });
});
