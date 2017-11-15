import * as fs from "memfs";

import { ITestResult } from "../../interfaces/ITestResult";

export class OutputStore {

    public readonly SRC_FILE_PATH: string;
    public readonly SRC_FILE: string;
    public readonly RUNNER: string;
    public readonly RUNNER_CONFIG: Object;

    public testFilePath: string;
    public lineNumber: number;
    public origionalCode: string;
    public mutatedCode: string;
    public numberOfFailedTests: number;
    public numberOfPassedTests: number;
    public mutantKilled;

    // public passedTestsDescription: Array<String>;
    // public failedTestsDescription: Array<String>;

    public constructor (
        srcPath: string,
        srcFile: string,
        testRunner: string,
        runnerConfig: Object
    ) {
        this.SRC_FILE_PATH = srcPath;
        this.SRC_FILE = srcFile;
        this.RUNNER = testRunner;
        this.RUNNER_CONFIG = runnerConfig;
    }

    public static writeOutputStoreToJson (outputStores: Array<OutputStore>) {
       fs.writeFileSync("./srcApp/app/outputStoreData.json", JSON.stringify(outputStores, null, 2));
    }

    public static writeDataToJson (data: Object) {
        fs.writeFileSync("./srcApp/app/data.json", JSON.stringify(data, null, 2));
    }

    public static setRunTime (runTime: number) {
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

    public setTestFile (filename: string) {
        this.testFilePath = filename;
    }

    public setLineNumber (lineNumber: number): void {
        this.lineNumber = lineNumber;
    }

    public setNumberOfTests (testResult: ITestResult){
        this.numberOfPassedTests = parseInt(testResult.passed, 0);
        this.numberOfFailedTests = parseInt(testResult.failed, 0);
        this.wasMutantKilled(this.numberOfFailedTests);
    }

    public setOrigionalSourceCode (code: string): void {
        const codeLines = code.split("\n");
        this.origionalCode = codeLines[this.lineNumber].trim();
    }

    public setModifiedSourceCode (code: string): void {
        const codeLines = code.split("\n");
        this.mutatedCode = codeLines[this.lineNumber].trim();
    }

    // was the mutant killed? true is killed (good)
    public wasMutantKilled (failedTests: number) {
        this.mutantKilled = failedTests > 0;
    }
}
