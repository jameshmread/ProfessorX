import { expect } from "chai";

import { ITestResult } from "../../interfaces/ITestResult";
import { OutputStore } from "./OutputStore";

describe("Output Store", () => {
    let outputStore: OutputStore;
    const origionalCode = `export class HelloWorld {
        public addNumbers (a: number, b: number) {
            return a + b;
        }
    }`;
    const firstLine = "export class HelloWorld {";
    let testResult: ITestResult;
    beforeEach(() => {
        outputStore = new OutputStore("", "", "", {});
        testResult = {passed: "0", failed: "2", totalRan: "0", duration: "20"};
    });

    it("ITestResult.passed of 0 should set passed tests to 0", () => {
        outputStore.setNumberOfTests(testResult);
        expect(outputStore.numberOfPassedTests).to.equal(0);
    });

    it("ITestResult.failed of 2 should set passed tests to 2", () => {
        outputStore.setNumberOfTests(testResult);
        expect(outputStore.numberOfFailedTests).to.equal(2);
    });

    it("should set origional code to the 0th line when given line 0", () => {
        outputStore.setLineNumber(0);
        outputStore.setOrigionalSourceCode(origionalCode);
        expect(outputStore.origionalCode).to.equal(firstLine);
    });


    it("should set origional code to the last line when line 4", () => {
        outputStore.setLineNumber(4);
        outputStore.setOrigionalSourceCode(origionalCode);
        expect(outputStore.origionalCode.toString()).to.equal("}");
    });

    it("should set modified code to the 0th line when given line 0", () => {
        outputStore.setLineNumber(0);
        outputStore.setModifiedSourceCode(origionalCode);
        expect(outputStore.mutatedCode).to.equal(firstLine);
    });


    it("should set modified code to the last line when line 4", () => {
        outputStore.setLineNumber(4);
        outputStore.setModifiedSourceCode(origionalCode);
        expect(outputStore.mutatedCode).to.equal("}");
    });

    it("mutant should be killed with failed tests > 0", () => {
        outputStore.wasMutantKilled(1);
        expect(outputStore.mutantKilled).to.equal(true);
    });

    it("mutant should survive with failed tests = 0", () => {
        outputStore.wasMutantKilled(0);
        expect(outputStore.mutantKilled).to.equal(false);
    });

    it("should set runtime to a date format of 0,0,0,0,300 when given 300", () => {
        expect(OutputStore.setRunTime(300)).to.eql({d: 0, h: 0, m: 0, s: 0, ms: 300});
    });

    it("should set runtime to 0,0,0,1,1 when given 1001", () => {
        expect(OutputStore.setRunTime(1001)).to.eql({d: 0, h: 0, m: 0, s: 1, ms: 1});
    });
});
