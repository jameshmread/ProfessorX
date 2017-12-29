import { expect } from "chai";
import * as Mocha from "mocha";

import { ConfigManager } from "./ConfigManager";

describe("Config manager", () => {
    let config: ConfigManager;
    beforeEach(() => {
        config = new ConfigManager();
    });

    it("config should not be null", () => {
        expect(ConfigManager.managerConfig).to.not.equal(void 0);
    });

    it("should not throw error for a standard config", () => {
        expect(() => {
            config.configValid();
        }).not.to.throw(Error);
    });

    it("should throw error if no configuration is given", () => {
        ConfigManager.managerConfig = null;
        expect(() => {
            config.configValid();
        }).to.throw(Error);
    });

    it("should return all the project files", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: false,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe"]
        };
        const actual = ConfigManager.getAllProjectFiles().length;
        const expected = ConfigManager.managerConfig.filesToMutate.length;
        expect(actual).to.equal(expected);
    });

    it("should return 0 project files when there are none", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: false,
            filesToMutate: [],
            filesToSkip: ["skipMe"]
        };
        const actual = ConfigManager.getAllProjectFiles().length;
        const expected = ConfigManager.managerConfig.filesToMutate.length;
        expect(actual).to.equal(expected);
    });

    it("should return the number of files to mutate - the files to skip", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: false,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe"]
        };
        const actual = ConfigManager.getPartialProjectFiles().length;
        const expected = 3;
        expect(actual).to.equal(expected);
    });

    it("should return the number of files to mutate, files to skip should remove extras", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: false,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe", "one", "newFile"]
        };
        const actual = ConfigManager.getPartialProjectFiles();
        const expected = ["two", "three"];
        expect(actual).to.eql(expected);
    });

    it("should return the filesToMutate when mutate files is true, ignoring filesToSkip", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: true,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe", "one", "newFile"]
        };
        const actual = ConfigManager.getAllProjectFiles();
        const expected = ["one", "two", "three", "skipMe"];
        expect(actual).to.eql(expected);
    });
});
