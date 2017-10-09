import * as fs from "fs";

import { ITestResult } from "../../interfaces/ITestResult";

export class OutputStore {

    public testFilePath: string;
    public lineNumber: number;
    public origionalCode: string;
    public mutatedCode: string;
    public numberOfFailedTests: number;
    public numberOfPassedTests: number;

    public passedTestsDescription: Array<String>;
    public failedTestsDescription: Array<String>;
    public mutationScore;

    public setTestFile (filename: string) {
        this.testFilePath = filename;
    }

    public setLineNumber (lineNumber: number): void {
        this.lineNumber = lineNumber;
    }

    public setNumberOfTests (testResult: ITestResult){
        this.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.setMutationScore(this.numberOfPassedTests, this.numberOfFailedTests);
    }

    public setOrigionalSourceCode (code: string): void {
        const codeLines = code.split("\n");
        this.origionalCode = codeLines[this.lineNumber].trim();
    }

    public setModifiedSourceCode (code: string): void {
        const codeLines = code.split("\n");
        this.mutatedCode = codeLines[this.lineNumber].trim();
    }

    public setMutationScore (passedTests: number, failedTests: number) {
        const totalTestsRan = passedTests + failedTests;
        this.mutationScore = Math.round((failedTests / totalTestsRan) * 100);
    }

    public writeOutputToJson(outputStore: Object) { 
       fs.appendFileSync("./srcApp/app/inputData.json", JSON.stringify(outputStore));
    }
}
