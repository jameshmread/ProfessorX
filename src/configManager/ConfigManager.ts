import * as fs from "fs";
import { resolve } from "path";

import { Logger } from "../logging/Logger";
import { IConfigFile } from "../../interfaces/IConfigFile";

export class ConfigManager {

    public static filePath: string;
    public static testFilePath: string;
    public static testFileExtension: string;

    public static filesToMutate: Array<string> = [];
    public static testFiles: Array<string> = [];
    public static testRunner: string;
    public static runnerConfig: Object;

    private static mutateAllFiles: boolean;
    private static filesToSkip: Array<string>;
    private projectFilesRetrieved: Array<string>;

    constructor (private configurationFile: IConfigFile) {
        this.projectFilesRetrieved = [];
        ConfigManager.mutateAllFiles = configurationFile.mutateAllFiles;
        ConfigManager.filePath = configurationFile.filePath;
        ConfigManager.filesToSkip = configurationFile.filesToSkip;
        ConfigManager.filesToMutate = configurationFile.filesToMutate;
        ConfigManager.testFilePath = configurationFile.testFilePath;
        ConfigManager.testFileExtension = configurationFile.testFileExtension;
        ConfigManager.testRunner = configurationFile.testRunner;
        ConfigManager.runnerConfig = configurationFile.runnerConfig;
        this.configValid();
    }

    public static removeSrcFilesWhichDontHaveTests (sourceFiles: Array<string>) {
        let testFilesWithoutExtension = [];
        testFilesWithoutExtension = this.testFiles.map((file) => {
            return file.replace(this.testFileExtension, "");
        });
        return testFilesWithoutExtension.filter((file) => {
            return sourceFiles.indexOf(file) >= 0;
        });
    }

    public getFilesToMutate () {
        this.setProjectTestFiles();
        // this.projectFilesRetrieved = [];
        if (ConfigManager.mutateAllFiles) {
            ConfigManager.filesToMutate =
                ConfigManager.removeSrcFilesWhichDontHaveTests(
                    ConfigManager.filterOutTestFiles(
                        this.getAllProjectFiles(ConfigManager.filePath))
                );
        } else {
        ConfigManager.filesToMutate =
            ConfigManager.removeSrcFilesWhichDontHaveTests(
                ConfigManager.filterOutTestFiles(
                    ConfigManager.filterFilesToMutateBySkipped())
        );
        }
    }

    public configValid () {
        Object.keys(ConfigManager).forEach((el) => {
            if (ConfigManager[el] === void 0) {
                Logger.fatal("Professor X config not valid. Not all keys are defined", this);
                throw new Error(
                    "Professor X config not valid. Not all keys are defined"
                );
            }
        });
    }

    private static preserveFilePath () {
        // TODO need to push the directory levels AFTER origional
        // config dir into files to mutate
    }

    private static filterFilesToMutateBySkipped (): Array<string> {
        return this.filesToMutate.filter((item) => {
            return this.filesToSkip.indexOf(item) < 0;
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
            return !file.endsWith(this.testFileExtension + ".ts");
        });
    }

    private static filterOutSrcFiles (files: Array<string>): Array<string> {
        return files.filter((file) => {
            return file.endsWith(this.testFileExtension + ".ts");
        });
    }

    private setProjectTestFiles () {
        ConfigManager.testFiles = ConfigManager.filterOutSrcFiles(
            this.getAllProjectFiles(ConfigManager.testFilePath));
    }

    private getAllProjectFiles (filePath: string): Array<string> {
        const currentDir = ConfigManager.readfileDirectory(filePath);
        currentDir.forEach((file) => {
            if (ConfigManager.isTypescriptFile(file)) {
                this.projectFilesRetrieved.push(file);
            } else {
                this.getAllProjectFiles(filePath + "/" + file);
            }
        });
        return this.projectFilesRetrieved;
    }
}
