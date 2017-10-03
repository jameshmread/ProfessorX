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
        /*tslint:disable:cyclomatic-complexity*/
        if (!(this.config &&
            this.filePath &&
            this.fileToMutate &&
            this.testRunner &&
            this.runnerConfig)){
                throw new Error("Professor X config");
        }
    }
}
