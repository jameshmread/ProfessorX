import * as Mocha from "mocha";

import { ITestResult } from "../../interfaces/ITestResult";
import { Printer } from "../output/printer/Printer";
import { OutputStore } from "../output/OutputStore";

export class MochaTestRunner {

    public testResult: ITestResult;
    public testFiles: Array<string> = [];
    // should this be changed to a single string?
    public mocha: Mocha;

    constructor (testFiles : Array<string>, config: Object) {
        this.mocha = new Mocha(config);
        this.testFiles = testFiles;
    }

    public addFiles (): boolean {
        if (this.testFiles.length === 0) {
            return false;
        }
        for (let i = 0; i < this.testFiles.length; i++){
            this.mocha.addFile(this.testFiles[i]);
        }
        return true;
    }

    public runTests (outputStore: OutputStore) {
        if (this.testFiles.length === 0 || this.testFiles === void 0) {
            return;
        }
        let runner = null;
        return new Promise((resolve, reject) => {
            runner = this.mocha.run(() => {
                const testResult: ITestResult = this.createTestResult(runner.stats);
                // not 100% happy with this but it works, so for now it can stay
                outputStore.setNumberOfTests(testResult);
                resolve(outputStore);
            });
        });
    }

    public createTestResult (stats): ITestResult {
        if (stats === void 0){
            throw new Error("Test result is undefined");
        }
        const result =
        {
            passed: stats.passes,
            failed: stats.failures,
            totalRan: stats.tests,
            duration: stats.duration
        };
        return result;
    }
}
