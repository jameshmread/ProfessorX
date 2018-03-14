import { Config } from "../../profx.conf";
import { Logger } from "../logging/Logger";
import * as fs from "fs";
import { resolve } from "path";

export class ConfigManager {
    public static managerConfig;

    public static filePath: string;
    public static filesToMutate: Array<string> = [];
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
        Logger.info("Files Found", ConfigManager.filesToMutate);
    }
    public static getFilesToMutate () {
        if (ConfigManager.managerConfig.mutateAllFiles) {
            ConfigManager.filesToMutate = ConfigManager.getAllProjectFiles(ConfigManager.filePath);
        } else {
            ConfigManager.filesToMutate = ConfigManager.getPartialProjectFiles();
        }
    }

    public configValid () {
        Object.keys(ConfigManager.managerConfig).forEach((el) => {
            if (ConfigManager.managerConfig[el] === void 0) {
                Logger.fatal("Professor X config not valid. Not all keys are defined", this);
                throw new Error(
                    "Professor X config not valid. Not all keys are defined"
                );
            }
        });
    }

    private static getAllProjectFiles (filePath: string): Array<string> {
        const currentDir = this.readfileDirectory(filePath);
        currentDir.forEach((file) => {
            if (this.isTypescriptFile(file)) {
                this.filesToMutate.push(file);
            } else {
                this.getAllProjectFiles(resolve(filePath, file));
            }
        });
        return this.filterOutTestFiles(this.filesToMutate);
    }

    private static getPartialProjectFiles (): Array<string> {
        return ConfigManager.managerConfig.filesToMutate.filter((item) => {
            return ConfigManager.managerConfig.filesToSkip.indexOf(item) < 0;
        });
    }

    private static readfileDirectory (file: string): Array<string> {
        return fs.readdirSync(file);
    }

    private static isTypescriptFile (fileName: string): boolean {
        return fileName.substring(fileName.length - 3, fileName.length) === ".ts";
    }

    private static filterOutTestFiles (files: Array<string>): Array<string> {
        return files.filter((file) => {
            return !file.endsWith(".spec.ts");
        });
    }
}
