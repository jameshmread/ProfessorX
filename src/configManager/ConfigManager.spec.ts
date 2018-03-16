import { expect } from "chai";
import * as Mocha from "mocha";

import { ConfigManager } from "./ConfigManager";
import { IConfigFile } from "../../interfaces/IConfigFile";

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
        const expected = ["FileTwo.ts", "HelloWorld.ts"];
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
        const expected = ["HelloWorld.ts"];
        expect(actual).to.eql(expected);
    });
});
