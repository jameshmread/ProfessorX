import * as Mocha from "mocha";

import { ITestResult } from "../../interfaces/ITestResult";
import { MutationResultManager } from "../mutationResultManager/MutationResultManager";
import { Logger } from "../logging/Logger";

export class MochaTestRunner {

    private mocha: Mocha;

    constructor (config: Object) {
        this.mocha = new Mocha(config);
    }

    public runTests (mResultManager: MutationResultManager, testFile: string) {
        this.mocha.addFile(testFile);
        let runner = null;
        return new Promise((resolve, reject) => {
        runner = this.mocha.run(() => {
                mResultManager.setNumberOfTests(this.createTestResult(runner.stats));
                resolve();
            });
        });
    }

    public createTestResult (stats): ITestResult {
        if (stats === void 0){
            Logger.fatal("Mocha Test result returned undefined", this);
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
