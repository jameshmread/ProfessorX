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
    const firstLine = "export class HelloWorld {";
    const functionArray = ["public addNumbers (a: number, b: number) {",
    "return a + b;",
    "}"];
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

    it("ITestResult.passed of 0 should set passed tests to 0", () => {
        mResultManager.setNumberOfTests(testResult);
        expect(mutationResult.numberOfPassedTests).to.equal(0);
    });

    it("ITestResult.failed of 2 should set passed tests to 2", () => {
        mResultManager.setNumberOfTests(testResult);
        expect(mutationResult.numberOfFailedTests).to.equal(2);
    });

    it("should set origional code to the function when given line 0", () => {
        mResultManager.setLineNumber(0);
        mResultManager.setSourceCodeLines({origional: origionalCode, mutated: origionalCode}, {pos: 26, end: 110});
        expect(mutationResult.origionalCode).to.eql(functionArray);
    });

    it("should set origional code to the function line when line 4", () => {
        mResultManager.setLineNumber(4);
        mResultManager.setSourceCodeLines({origional: origionalCode, mutated: origionalCode}, {pos: 26, end: 110});
        expect(mutationResult.origionalCode).to.eql(functionArray);
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
    // it("should set modified code to the 0th line when given line 0", () => {
    //     mResultManager.setLineNumber(0);
    //     mResultManager.setModifiedSourceCode(origionalCode);
    //     expect(mutationResult.mutatedCode).to.equal(firstLine);
    // });

    // it("should set modified code to the last line when line 4", () => {
    //     mResultManager.setLineNumber(4);
    //     mResultManager.setModifiedSourceCode(origionalCode);
    //     expect(mutationResult.mutatedCode).to.equal("}");
    // });

    it("should return true (killed) with failed tests > 0", () => {
        expect(mResultManager.wasMutantKilled(1)).to.equal(true);
    });

    it("should return false (survived) with failed tests = 0", () => {
        expect(mResultManager.wasMutantKilled(0)).to.equal(false);
    });
});
