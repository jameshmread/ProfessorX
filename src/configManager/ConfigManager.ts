/*tslint:disable:no-var-requires*/
const config = require("../../profx-config.json");
/*tslint:enable:no-var-requires*/

export class ConfigManager {
    public config = config;
    public filePath: string;
    public fileToMutate: string;
    public testRunner: string;
    public runnerConfig: Object;
    public displayPort: string;

    constructor (){
        this.filePath = this.config["filePath"];
        this.fileToMutate = this.config["fileToMutate"];
        this.testRunner = this.config["testRunner"];
        this.runnerConfig = this.config["runnerConfig"];
        this.configValid();
    }

    public configValid () {
        Object.keys(this.config).forEach((el) => {
            console.log(this.config[el]);
            if (this.config[el] === void 0) {
                throw new Error(
                    "Professor X config not valid. Not all keys are defined");
            }
            });

    }
}
