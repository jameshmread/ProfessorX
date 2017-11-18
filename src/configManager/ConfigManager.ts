/*tslint:disable:no-var-requires*/
const config = require("../../profx-config.json");
/*tslint:enable:no-var-requires*/

export class ConfigManager {
    public static filePath: string;
    public static fileToMutate: string;
    public static testRunner: string;
    public static runnerConfig: Object;
    public static displayPort: string;
    public config = config;

    constructor (){
        ConfigManager.filePath = this.config["filePath"];
        ConfigManager.fileToMutate = this.config["fileToMutate"];
        ConfigManager.testRunner = this.config["testRunner"];
        ConfigManager.runnerConfig = this.config["runnerConfig"];
        this.configValid();
    }

    public configValid () {
        Object.keys(this.config).forEach((el) => {
            if (this.config[el] === void 0) {
                throw new Error(
                    "Professor X config not valid. Not all keys are defined");
            }
            });

    }
}
