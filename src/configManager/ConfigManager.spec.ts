import { expect } from "chai";
import * as Mocha from "mocha";

import { ConfigManager } from "./ConfigManager";
import { IConfigFile } from "../../interfaces/IConfigFile";
import { resolve } from "path";

describe("Config manager", () => {
    let config: ConfigManager;
    const configFile: IConfigFile = {
        filesToMutate: [],
        mutateAllFiles: true,
        filesToSkip: [],
        runnerConfig: {}, filePath: "./testProject/src/",
        testFileExtension: ".spec", testFilePath: "./testProject/src/",
        testRunner: "mocha"
    };
    beforeEach(() => {
        config = new ConfigManager(configFile);
        ConfigManager.filesToMutate = [];
        ConfigManager.testFiles = [];
    });

    it("should not throw error for a standard config", () => {
        expect(() => {
            config.configValid();
        }).not.to.throw(Error);
    });

    it("should throw error if no configuration is given", () => {
        expect(() => {
            const nullConfig = new ConfigManager(null);
            nullConfig.configValid();
        }).to.throw(Error);
    });

    it("should return the filesToMutate when mutate files is true, ignoring filesToSkip", () => {
        config.getFilesToMutate();
        const actual = ConfigManager.filesToMutate;
        const expected = [resolve(ConfigManager.filePath, "HelloWorld.ts"),
        resolve(ConfigManager.filePath, "FileTwo.ts")];
        expect(actual).to.eql(expected);
    });

    it("should return only the src file when there it has a test file", () => {
        ConfigManager.testFiles = ["/test/Hey.spec.ts"];
        const actual = ConfigManager.removeSrcFilesWhichDontHaveTests(["/src/Hey.ts", "/src/notForMe.ts"]);
        const expected = ["/src/Hey.ts"];
        expect(actual).to.eql(expected);
    });

    it("should return no files when there are no test files for any src files", () => {
        ConfigManager.testFiles = ["Hey.spec.ts"];
        const actual = ConfigManager.removeSrcFilesWhichDontHaveTests(["NoTestForMe.ts"]);
        const expected = [];
        expect(actual).to.eql(expected);
    });

    it("should return the one and only file when it has a test file", () => {
        ConfigManager.testFiles = ["Hey.spec.ts"];
        const actual = ConfigManager.removeSrcFilesWhichDontHaveTests(["Hey.ts"]);
        const expected = ["Hey.ts"];
        expect(actual).to.eql(expected);
    });

    it("should return one file when given files with file paths", () => {
        ConfigManager.testFiles = ["testProject/test/Hey.spec.ts"];
        const actual = ConfigManager.removeSrcFilesWhichDontHaveTests(["testProject/src/Hey.ts"]);
        const expected = ["testProject/src/Hey.ts"];
        expect(actual).to.eql(expected);
    });

    it("should return the filesToMutate - files to skip when mutate all files is false", () => {
        const tempConfig = {
            mutateAllFiles: false,
            filesToMutate: ["FileTwo.ts", "HelloWorld.ts"],
            filesToSkip: ["FileTwo.ts"],
            runnerConfig: {}, filePath: "./testProject/src/",
            testFileExtension: ".spec", testFilePath: "./testProject/src/",
            testRunner: "mocha"
        };
        const cm = new ConfigManager(tempConfig);
        cm.getFilesToMutate();
        const actual = ConfigManager.filesToMutate;
        const expected = [resolve(ConfigManager.filePath, "HelloWorld.ts")];
        expect(actual).to.eql(expected);
    });
});
