import * as Mocha from "mocha";

import { ITestResult } from "../../interfaces/ITestResult";
import { OutputStoreManager } from "../output/OutputStoreManager";

export class MochaTestRunner {

    private mocha: Mocha;

    constructor (config: Object) {
        this.mocha = new Mocha(config);
    }

    public runTests (outputStoreManager: OutputStoreManager, testFile: string) {
        this.mocha.addFile(testFile);
        let runner = null;
        return new Promise((resolve, reject) => {
        runner = this.mocha.run(() => {
                // not 100% happy with this but it works, so for now it can stay
                outputStoreManager.setNumberOfTests(this.createTestResult(runner.stats));
                resolve();
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
