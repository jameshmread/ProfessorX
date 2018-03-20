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
        try{
            runner = this.mocha.run(() => {
                if (runner.stats.failures < 1) {
                    resolve("survived");
                } else { resolve("killed"); }});
        } catch (error) {
            Logger.fatal("Mocha Runner Failed. Status:", runner);
            reject();
        }
        });
    }
}
