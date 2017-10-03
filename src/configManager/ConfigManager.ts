/*tslint:disable:no-var-requires*/
const config = require("../../profx-config.json");
/*tslint:enable:no-var-requires*/

export class ConfigManager {
    public config = config;
    public filePath: string;
    public fileToMutate: string;
    public testRunner: string;
    public runnerConfig: Object;

    constructor (){
        this.filePath = this.config["filePath"];
        this.fileToMutate = this.config["fileToMutate"];
        this.testRunner = this.config["testRunner"];
        this.runnerConfig = this.config["runnerConfig"];
        this.configValid();
    }

    public configValid () : boolean {
    let isValid = false;
    Object.keys(this).forEach((key) => {
        if (this[key] === void 0) {
            isValid = false;
            throw new Error(
                `Professor X config not valid
                key: ` + key + "is not defined");
            }
        else {
            isValid = true;
        }
    });
    return isValid;
    }
}
