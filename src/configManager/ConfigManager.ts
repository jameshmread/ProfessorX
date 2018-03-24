import * as fs from "fs";
import { resolve, basename } from "path";

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
        ConfigManager.filesToSkip =
        configurationFile.filesToSkip.map((skipping) => resolve(configurationFile.filePath, skipping));
        ConfigManager.filesToMutate =
        configurationFile.filesToMutate.map((file) => resolve(configurationFile.filePath, file));
        ConfigManager.testFilePath = configurationFile.testFilePath;
        ConfigManager.testFileExtension = configurationFile.testFileExtension;
        ConfigManager.testRunner = configurationFile.testRunner;
        ConfigManager.runnerConfig = configurationFile.runnerConfig;
        this.configValid();
    }

    public static removeSrcFilesWhichDontHaveTests (sourceFiles: Array<string>): Array<string> {
        let testFilesWithoutExtension: Array<string> = [];
        testFilesWithoutExtension = this.testFiles.map((file) => {
            return basename(file.replace(this.testFileExtension, ""));
        });
        return sourceFiles.filter((file) => {
            return testFilesWithoutExtension.indexOf(basename(file)) >= 0;
        });
    }

    public getFilesToMutate () {
        this.setProjectTestFiles();
        this.projectFilesRetrieved = [];
        // reset files retrieved because test files fills that array first, causing duplicates
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

    private static filterFilesToMutateBySkipped (): Array<string> {
        return this.filesToMutate.filter((item) => {
            return this.filesToSkip.indexOf(item) < 0;
        });
    }

    private static readfileDirectory (file: string): Array<string> {
        if (fs.statSync(file).isDirectory()) {
            return fs.readdirSync(file);
        } else {
            return [];
        }
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
                this.projectFilesRetrieved.push(resolve(filePath, file));
            } else {
                this.getAllProjectFiles(filePath + "/" + file);
            }
        });
        return this.projectFilesRetrieved;
    }
}
