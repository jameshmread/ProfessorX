import * as fs from "fs";

import { ITestResult } from "../../interfaces/ITestResult";
import { OutputStore } from "../../DTOs/OutputStore";
import { IDurationFormat } from "../../interfaces/IDurationFormat";

export class OutputStoreManager {

    public static outputStoreList: Array<OutputStore> = [];

    public constructor (
        private outputStoreData: OutputStore
    ) {}

    public static writeOutputStoreToJson (outputStores: Array<OutputStoreManager>) {
       fs.writeFileSync("./srcApp/app/outputStoreData.json", JSON.stringify(outputStores, null, 2));
    }

    public static writeDataToJson (data: Object) {
        fs.writeFileSync("./srcApp/app/data.json", JSON.stringify(data, null, 2));
    }

    public static setRunTime (runTime: number): IDurationFormat {
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
        return { d, h, m, s, ms };
    }

    public saveOutputStore (): void {
        OutputStoreManager.outputStoreList.push(this.outputStoreData);
    }

    public setTestFile (filename: string): void {
        this.outputStoreData.testFilePath = filename;
    }

    public setLineNumber (lineNumber: number): void {
        this.outputStoreData.lineNumber = lineNumber;
    }

    public setNumberOfTests (testResult: ITestResult): void {
        this.outputStoreData.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.outputStoreData.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.outputStoreData.mutantKilled =
        this.wasMutantKilled(this.outputStoreData.numberOfFailedTests);
    }

    public setOrigionalSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.outputStoreData.origionalCode =
        codeLines[this.outputStoreData.lineNumber].trim();
    }

    public setModifiedSourceCode (code: string): void {
        const codeLines = this.splitCodeByLine(code);
        this.outputStoreData.mutatedCode =
        codeLines[this.outputStoreData.lineNumber].trim();
    }

    // was the mutant killed? true is killed (good)
    public wasMutantKilled (failedTests: number): boolean {
        return failedTests > 0;
    }

    private splitCodeByLine (code: string): Array<string> {
        return code.split("\n");
    }
}
