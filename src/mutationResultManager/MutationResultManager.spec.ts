import { expect } from "chai";

import { ITestResult } from "../../interfaces/ITestResult";
import { MutationResultManager } from "./MutationResultManager";
import { MutationResult } from "../../DTOs/MutationResult";

describe("Mutation Result Manager", () => {
    let mutationResult: MutationResult;
    let mResultManager: MutationResultManager;
    const origionalCode = `export class HelloWorld {
        public addNumbers (a: number, b: number) {
            return a + b;
        }
    }`;
    const firstLine = "export class HelloWorld {";
    let testResult: ITestResult;
    mutationResult = new MutationResult("./TestPath", "SourceFileName.ts");

    beforeEach(() => {
        mResultManager = new MutationResultManager();
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

    it("should set origional code to the 0th line when given line 0", () => {
        mResultManager.setLineNumber(0);
        mResultManager.setOrigionalSourceCode(origionalCode);
        expect(mutationResult.origionalCode).to.equal(firstLine);
    });


    it("should set origional code to the last line when line 4", () => {
        mResultManager.setLineNumber(4);
        mResultManager.setOrigionalSourceCode(origionalCode);
        expect(mutationResult.origionalCode.toString()).to.equal("}");
    });

    it("should set modified code to the 0th line when given line 0", () => {
        mResultManager.setLineNumber(0);
        mResultManager.setModifiedSourceCode(origionalCode);
        expect(mutationResult.mutatedCode).to.equal(firstLine);
    });


    it("should set modified code to the last line when line 4", () => {
        mResultManager.setLineNumber(4);
        mResultManager.setModifiedSourceCode(origionalCode);
        expect(mutationResult.mutatedCode).to.equal("}");
    });

    it("should return true (killed) with failed tests > 0", () => {
        expect(mResultManager.wasMutantKilled(1)).to.equal(true);
    });

    it("should return false (survived) with failed tests = 0", () => {
        expect(mResultManager.wasMutantKilled(0)).to.equal(false);
    });
});
