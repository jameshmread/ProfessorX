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

    it("should return the filesToMutate when mutate files is true, ignoring filesToSkip", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: true,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe", "one", "newFile"]
        };
        ConfigManager.getFilesToMutate();
        const actual = ConfigManager.managerConfig.filesToMutate;
        const expected = ["one", "two", "three", "skipMe"];
        expect(ConfigManager.managerConfig.mutateAllFiles).to.equal(true);
        expect(actual).to.eql(expected);
    });

    it("should return the filesToMutate - files to skip when files to mutate is false", () => {
        ConfigManager.managerConfig = {
            mutateAllFiles: false,
            filesToMutate: ["one", "two", "three", "skipMe"],
            filesToSkip: ["skipMe", "one", "newFile"]
        };
        ConfigManager.getFilesToMutate();
        const actual = ConfigManager.filesToMutate;
        const expected = ["two", "three"];
        expect(ConfigManager.managerConfig.mutateAllFiles).to.equal(false);
        expect(actual).to.eql(expected);
    });
});
