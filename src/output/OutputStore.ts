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
    public runTime: Object;

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

    public setRunTime (runTime: number) {
        /*
            convert millis to date time adapted from
            https://gist.github.com/remino/1563878
        */
        let ms = runTime;
        ms = ms % 1000;
        let s = Math.floor(runTime / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        this.runTime = { d, h, m, s, ms };
    }

    public writeOutputToJson (outputStore: Object) {
       fs.appendFileSync("./srcApp/app/inputData.json", JSON.stringify(outputStore));
    }
}
