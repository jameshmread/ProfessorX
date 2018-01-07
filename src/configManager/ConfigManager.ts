import { Config } from "../../profx.conf";

export class ConfigManager {
    public static managerConfig;

    public static filePath: string;
    public static filesToMutate: Array<string>;
    public static testRunner: string;
    public static runnerConfig: Object;

    private static mutateAllFiles: boolean;
    private static filesToSkip: Array<string>;

    constructor () {
        ConfigManager.managerConfig = Config.CONFIG;
        ConfigManager.filePath = Config.CONFIG.filePath;
        ConfigManager.testRunner = Config.CONFIG.testRunner;
        ConfigManager.runnerConfig = Config.CONFIG.runnerConfig;
        this.configValid();
    }

    public static getAllProjectFiles (): Array<string> {
        return ConfigManager.managerConfig.filesToMutate;
    }

    public static getPartialProjectFiles (): Array<string> {
        return ConfigManager.managerConfig.filesToMutate.filter((item) => {
            return ConfigManager.managerConfig.filesToSkip.indexOf(item) < 0;
        });
    }

    public static getFilesToMutate () {
        if (ConfigManager.managerConfig.mutateAllFiles) {
            ConfigManager.filesToMutate = ConfigManager.getAllProjectFiles();
        } else {
            ConfigManager.filesToMutate = ConfigManager.getPartialProjectFiles();
        }
    }

    public configValid () {
        Object.keys(ConfigManager.managerConfig).forEach((el) => {
            if (ConfigManager.managerConfig[el] === void 0) {
                throw new Error(
                    "Professor X config not valid. Not all keys are defined"
                );
            }
        });
    }
}
